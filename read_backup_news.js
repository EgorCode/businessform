
import Database from 'better-sqlite3';

const dbPath = 'E:/BizStartMaster2/local.db';

try {
    const db = new Database(dbPath, { readonly: true });

    const news = db.prepare("SELECT id, title, content, publishedAt FROM news").all();
    console.log('News found:', news.length);

    // Print titles to see if they match what we are looking for
    news.forEach(n => console.log(`[${n.id}] ${n.title}`));

    db.close();
} catch (error) {
    console.error('Error reading DB:', error);
}
