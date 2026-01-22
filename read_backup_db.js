
import Database from 'better-sqlite3';

const dbPath = 'E:/BizStartMaster2/local.db';

try {
    const db = new Database(dbPath, { readonly: true });

    // List tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables);

    db.close();
} catch (error) {
    console.error('Error reading DB:', error);
}
