#!/bin/bash

# 🎨 Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Начинаю установку и запуск BizStartMaster...${NC}"

# 1. Проверка и установка Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️ Node.js не найден. Устанавливаю Node.js 20...${NC}"
    # Предполагаем, что это Ubuntu/Debian
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js уже установлен ($(node -v))${NC}"
fi

# 2. Проверка и установка PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️ PM2 не найден. Устанавливаю...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 уже установлен${NC}"
fi

# 3. Установка зависимостей
echo -e "${GREEN}📦 Устанавливаю зависимости (npm install)...${NC}"
npm install

# 4. Проверка .env
if [ ! -f .env ]; then
    echo -e "${RED}⚠️ Файл .env не найден!${NC}"
    echo -e "${YELLOW}Создаю базовый .env... НЕ ЗАБУДЬТЕ ЕГО ОТРЕДАКТИРОВАТЬ!${NC}"
    
    cat > .env << EOL
NODE_ENV=production
PORT=5000
DATABASE_URL=sqlite:./prod.db
SESSION_SECRET=change_me_please_very_secret_key
# Вставьте сюда ваши API ключи
EOL
    
    echo -e "${YELLOW}⚠️ Файл .env создан. Пожалуйста, откройте его (nano .env) и внесите настройки после завершения скрипта.${NC}"
fi

# 5. Сборка проекта
echo -e "${GREEN}🔨 Собираю проект (npm run build)...${NC}"
npm run build

# 6. Запуск через PM2
echo -e "${GREEN}🚀 Запускаю сервер через PM2...${NC}"

# Останавливаем предыдущий процесс, если был
pm2 delete bizstart 2>/dev/null || true

# Запускаем новый
pm2 start npm --name "bizstart" -- run start

# Сохраняем список процессов для автозапуска
pm2 save

echo -e "${GREEN}✅ Готово! Сервер запущен.${NC}"
echo -e "${YELLOW}ℹ️  Проверить статус: pm2 status${NC}"
echo -e "${YELLOW}ℹ️  Смотреть логи: pm2 logs bizstart${NC}"
