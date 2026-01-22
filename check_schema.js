
import Database from 'better-sqlite3';

const dbPath = 'E:/BizStartMaster2/local.db';

try {
    const db = new Database(dbPath, { readonly: true });

    // Get table info for 'news'
    const columns = db.prepare("PRAGMA table_info(news)").all();
    console.log('Columns:', columns.map(c => c.name));

    db.close();
} catch (error) {
    console.error('Error reading DB:', error);
}
