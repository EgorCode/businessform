#!/usr/bin/env tsx

import { existsSync } from 'fs';
import Database from 'better-sqlite3';
import { join } from 'path';

console.log('🔍 Проверка базы данных BizStartMaster...');

try {
  const dbPath = './local.db';
  
  // Проверяем существование файла базы данных
  if (!existsSync(dbPath)) {
    console.log('❌ Файл базы данных не найден:', dbPath);
    console.log('💡 Выполните "npm run db:init" для создания базы данных');
    process.exit(1);
  }

  console.log('✅ Файл базы данных найден:', dbPath);

  // Проверяем подключение к базе данных
  try {
    const db = new Database(dbPath);
    
    // Проверяем наличие таблицы users
    const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    
    if (result) {
      console.log('✅ Таблица users существует');
      
      // Проверяем количество записей
      const count = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
      console.log(`📊 Количество пользователей: ${count.count}`);
    } else {
      console.log('⚠️ Таблица users не найдена');
      console.log('💡 Выполните "npm run db:init" для создания таблиц');
    }
    
    db.close();
    console.log('✅ База данных работает корректно');
    
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Ошибка при проверке базы данных:', error);
  process.exit(1);
}