#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 Инициализация базы данных BizStartMaster...');

try {
  // Проверяем наличие файла базы данных
  const dbPath = './local.db';
  if (existsSync(dbPath)) {
    console.log('✅ Файл базы данных уже существует:', dbPath);
  } else {
    console.log('📝 Создание новой базы данных...');
  }

  // Применяем миграции через drizzle-kit
  console.log('🚀 Применение миграций...');
  execSync('npx drizzle-kit push', { stdio: 'inherit' });

  console.log('✅ База данных успешно инициализирована!');
  console.log('📍 Расположение:', join(process.cwd(), dbPath));
  
} catch (error) {
  console.error('❌ Ошибка при инициализации базы данных:', error);
  process.exit(1);
}