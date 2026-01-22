
import Database from 'better-sqlite3';
import fs from 'fs';

const dbPath = 'E:/BizStartMaster2/local.db';

try {
    const db = new Database(dbPath, { readonly: true });

    const news = db.prepare("SELECT id, title, content, summary FROM news").all();
    console.log('News items found:', news.length);

    // Save to a JSON file so I can read it easily with view_file tool
    fs.writeFileSync('restored_news.json', JSON.stringify(news, null, 2));
    console.log('Saved to restored_news.json');

    // Also log titles
    news.forEach(n => console.log(`[${n.id}] ${n.title}`));

    db.close();
} catch (error) {
    console.error('Error reading DB:', error);
}
