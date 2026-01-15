#!/usr/bin/env tsx

import { existsSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔄 Сброс базы данных BizStartMaster...');

try {
  const dbPath = './local.db';
  
  // Проверяем существование файла базы данных
  if (existsSync(dbPath)) {
    console.log('🗑️ Удаление существующей базы данных...');
    unlinkSync(dbPath);
    console.log('✅ База данных удалена:', dbPath);
  } else {
    console.log('ℹ️ Файл базы данных не найден, создание новой...');
  }

  // Создаем новую базу данных
  console.log('🚀 Создание новой базы данных...');
  execSync('npx drizzle-kit push', { stdio: 'inherit' });

  console.log('✅ База данных успешно сброшена и инициализирована!');
  console.log('📍 Расположение:', dbPath);
  
} catch (error) {
  console.error('❌ Ошибка при сбросе базы данных:', error);
  process.exit(1);
}