#!/usr/bin/env tsx

import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

console.log('🔍 Проверка зависимостей BizStartMaster...');

try {
  // Проверяем наличие package.json
  const packageJsonPath = './package.json';
  if (!existsSync(packageJsonPath)) {
    console.error('❌ Файл package.json не найден');
    process.exit(1);
  }

  // Проверяем наличие node_modules
  const nodeModulesPath = './node_modules';
  if (!existsSync(nodeModulesPath)) {
    console.log('❌ Папка node_modules не найдена');
    console.log('📦 Установка зависимостей...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Зависимости установлены');
  } else {
    console.log('✅ Папка node_modules найдена');
  }

  // Проверяем наличие tsx
  try {
    execSync('npx tsx --version', { stdio: 'pipe' });
    console.log('✅ tsx доступен');
  } catch (error) {
    console.log('❌ tsx не найден, установка...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Проверяем наличие drizzle-kit
  try {
    execSync('npx drizzle-kit --version', { stdio: 'pipe' });
    console.log('✅ drizzle-kit доступен');
  } catch (error) {
    console.log('❌ drizzle-kit не найден, установка...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Проверяем основные зависимости
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const criticalDeps = ['express', 'react', 'drizzle-orm', 'better-sqlite3'];
  
  console.log('🔍 Проверка критических зависимостей...');
  for (const dep of criticalDeps) {
    const depPath = join(nodeModulesPath, dep);
    if (existsSync(depPath)) {
      console.log(`✅ ${dep} установлен`);
    } else {
      console.log(`❌ ${dep} не найден`);
      console.log('📦 Переустановка всех зависимостей...');
      execSync('npm install', { stdio: 'inherit' });
      break;
    }
  }

  console.log('✅ Все зависимости в порядке!');
  
} catch (error) {
  console.error('❌ Ошибка при проверке зависимостей:', error);
  process.exit(1);
}