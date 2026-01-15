const Database = require('better-sqlite3');
const sqlite = new Database('./local.db');

try {
  const news = sqlite.prepare('SELECT id, title, priority FROM news WHERE isActive = 1 ORDER BY priority DESC, publishedAt DESC LIMIT 3').all();
  console.log('Top 3 news:', JSON.stringify(news, null, 2));
  
  const allNews = sqlite.prepare('SELECT id, title, priority FROM news WHERE isActive = 1 ORDER BY id').all();
  console.log('All news:', JSON.stringify(allNews, null, 2));
} catch (error) {
  console.error('Error:', error);
} finally {
  sqlite.close();
}