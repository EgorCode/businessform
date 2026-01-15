# Руководство по развертыванию BizStartMaster на VPS сервере

## Обзор архитектуры проекта

BizStartMaster - это веб-приложение для помощи в запуске бизнеса с ИИ-помощником, построенное на следующем стеке:

### Backend
- **Node.js** + **Express.js** - серверная часть
- **TypeScript** - типизация
- **SQLite** + **Drizzle ORM** - база данных
- **better-sqlite3** - драйвер SQLite
- **Google Gemini API** - ИИ-функциональность

### Frontend
- **React** - UI библиотека
- **Vite** - сборщик
- **TypeScript** - типизация
- **Tailwind CSS** - стили
- **Radix UI** - компоненты интерфейса

### ИИ-интеграция
- **Google Gemini API** - модель искусственного интеллекта
- **Кэширование ответов** - оптимизация производительности
- **Rate limiting** - защита от злоупотреблений

## Требования к серверу

### Минимальные системные требования
- **ОС**: Ubuntu 20.04+ / Debian 10+
- **CPU**: 1 ядро
- **RAM**: 1 ГБ (рекомендуется 2 ГБ)
- **Диск**: 10 ГБ свободного пространства
- **Сеть**: доступ к портам 80, 443

### Программное обеспечение
- **Node.js**: 18.x или выше
- **npm**: 9.x или выше
- **Apache**: 2.4+
- **Git**: для клонирования репозитория

## Пошаговая инструкция по развертыванию

### Шаг 1: Подготовка сервера

#### 1.1 Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

#### 1.2 Установка необходимых пакетов
```bash
# Установка Apache
sudo apt install apache2 -y

# Установка Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Git
sudo apt install git -y

# Установка дополнительных пакетов
sudo apt install build-essential -y
```

#### 1.3 Настройка Apache
```bash
# Включение необходимых модулей
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite

# Перезапуск Apache
sudo systemctl restart apache2
sudo systemctl enable apache2
```

### Шаг 2: Развертывание приложения

#### 2.1 Клонирование репозитория
```bash
# Создание директории для проекта
sudo mkdir -p /var/www/bizstartmaster
cd /var/www/bizstartmaster

# Клонирование проекта (замените URL на ваш репозиторий)
sudo git clone <REPOSITORY_URL> .

# Установка прав доступа
sudo chown -R www-data:www-data /var/www/bizstartmaster
sudo chmod -R 755 /var/www/bizstartmaster
```

#### 2.2 Установка зависимостей и сборка
```bash
cd /var/www/bizstartmaster

# Установка зависимостей
sudo -u www-data npm install

# Сборка проекта
sudo -u www-data npm run build

# Инициализация базы данных
sudo -u www-data npm run db:init
```

#### 2.3 Настройка переменных окружения
```bash
# Создание production-файла окружения
sudo cp .env .env.production

# Редактирование файла окружения
sudo nano .env.production
```

Содержимое файла `.env.production`:
```env
# Database configuration
DATABASE_URL=sqlite:./local.db

# Server configuration
PORT=5000
NODE_ENV=production

# Session configuration
SESSION_SECRET=your-very-secure-secret-key-here-change-in-production

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3-pro-preview-11-2025
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# AI Service Configuration
AI_CACHE_TTL=300000        # 5 минут в мс
AI_RATE_LIMIT=100          # запросов в час
AI_MAX_TOKENS=800         # максимальное количество токенов
AI_TEMPERATURE=0.7         # температура генерации

# Security
CORS_ORIGIN=http://your-server-ip
API_KEY_HEADER=X-API-Key

# Client-side environment variables
VITE_AI_API_URL=/api/ai
VITE_AI_API_KEY=demo-key
```

### Шаг 3: Настройка Apache

#### 3.1 Создание конфигурационного файла VirtualHost
```bash
sudo nano /etc/apache2/sites-available/bizstartmaster.conf
```

Содержимое файла `bizstartmaster.conf`:
```apache
<VirtualHost *:80>
    ServerName your-server-ip
    ServerAdmin admin@your-domain.com
    
    # Базовая директория проекта
    DocumentRoot /var/www/bizstartmaster/dist/public
    
    # Логи
    ErrorLog ${APACHE_LOG_DIR}/bizstartmaster_error.log
    CustomLog ${APACHE_LOG_DIR}/bizstartmaster_access.log combined
    
    # Настройка прокси для Node.js приложения
    ProxyPreserveHost On
    ProxyRequests Off
    
    # Проксирование API запросов к Node.js
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
    
    # Обработка статических файлов
    <Directory /var/www/bizstartmaster/dist/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Заголовки безопасности
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Сжатие
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css text/javascript application/javascript application/xml+rss application/json
</VirtualHost>
```

#### 3.2 Активация сайта
```bash
# Отключение сайта по умолчанию
sudo a2dissite 000-default.conf

# Активация сайта BizStartMaster
sudo a2ensite bizstartmaster.conf

# Проверка конфигурации Apache
sudo apache2ctl configtest

# Перезапуск Apache
sudo systemctl restart apache2
```

### Шаг 4: Настройка systemd сервиса

#### 4.1 Создание файла сервиса
```bash
sudo nano /etc/systemd/system/bizstartmaster.service
```

Содержимое файла `bizstartmaster.service`:
```ini
[Unit]
Description=BizStartMaster Node.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/bizstartmaster
Environment=NODE_ENV=production
EnvironmentFile=/var/www/bizstartmaster/.env.production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=bizstartmaster

[Install]
WantedBy=multi-user.target
```

#### 4.2 Управление сервисом
```bash
# Перезагрузка systemd
sudo systemctl daemon-reload

# Запуск сервиса
sudo systemctl start bizstartmaster

# Включение автозапуска
sudo systemctl enable bizstartmaster

# Проверка статуса
sudo systemctl status bizstartmaster
```

### Шаг 5: Мониторинг и логирование

#### 5.1 Просмотр логов приложения
```bash
# Логи systemd сервиса
sudo journalctl -u bizstartmaster -f

# Логи Apache
sudo tail -f /var/log/apache2/bizstartmaster_access.log
sudo tail -f /var/log/apache2/bizstartmaster_error.log
```

#### 5.2 Настройка ротации логов
```bash
sudo nano /etc/logrotate.d/bizstartmaster
```

Содержимое файла:
```
/var/log/apache2/bizstartmaster_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload apache2
    endscript
}
```

## Обновление проекта

### Процесс обновления
```bash
cd /var/www/bizstartmaster

# Остановка сервиса
sudo systemctl stop bizstartmaster

# Получение обновлений
sudo -u www-data git pull origin main

# Установка новых зависимостей
sudo -u www-data npm install

# Сборка проекта
sudo -u www-data npm run build

# Применение миграций базы данных (если есть)
sudo -u www-data npm run db:push

# Запуск сервиса
sudo systemctl start bizstartmaster

# Проверка статуса
sudo systemctl status bizstartmaster
```

## Резервное копирование

### Скрипт резервного копирования базы данных
```bash
sudo nano /usr/local/bin/backup-bizstartmaster.sh
```

Содержимое скрипта:
```bash
#!/bin/bash

# Директория для бэкапов
BACKUP_DIR="/var/backups/bizstartmaster"
DATE=$(date +%Y%m%d_%H%M%S)

# Создание директории
mkdir -p $BACKUP_DIR

# Копирование базы данных
cp /var/www/bizstartmaster/local.db $BACKUP_DIR/local_$DATE.db

# Удаление старых бэкапов (оставляем последние 7 дней)
find $BACKUP_DIR -name "local_*.db" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/local_$DATE.db"
```

Сделать скрипт исполняемым и добавить в cron:
```bash
sudo chmod +x /usr/local/bin/backup-bizstartmaster.sh

# Добавление в cron для ежедневного выполнения в 2:00
sudo crontab -e
```

Добавить строку:
```
0 2 * * * /usr/local/bin/backup-bizstartmaster.sh
```

## Безопасность

### Рекомендации по безопасности
1. **Регулярно обновляйте систему**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Настройте firewall**:
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   ```

3. **Используйте надежные пароли** и SSH ключи

4. **Регулярно делайте резервные копии**

5. **Мониторьте логи** на предмет подозрительной активности

## Поиск и устранение проблем

### Частые проблемы

#### 1. Приложение не запускается
```bash
# Проверка статуса сервиса
sudo systemctl status bizstartmaster

# Просмотр логов
sudo journalctl -u bizstartmaster -n 50
```

#### 2. Ошибки Apache
```bash
# Проверка конфигурации
sudo apache2ctl configtest

# Просмотр логов ошибок
sudo tail -f /var/log/apache2/bizstartmaster_error.log
```

#### 3. Проблемы с базой данных
```bash
# Проверка состояния БД
cd /var/www/bizstartmaster
sudo -u www-data npm run db:check

# Пересоздание БД (в крайнем случае)
sudo -u www-data npm run db:reset
```

#### 4. Проблемы с зависимостями
```bash
# Переустановка зависимостей
cd /var/www/bizstartmaster
sudo -u www-data rm -rf node_modules
sudo -u www-data npm install
```

## Производительность

### Оптимизация
1. **Используйте PM2** для управления процессами Node.js (опционально)
2. **Настройте кэширование** на уровне Apache
3. **Оптимизируйте изображения** и статические ресурсы
4. **Мониторьте использование ресурсов** сервера

### Мониторинг ресурсов
```bash
# Использование CPU и памяти
htop

# Использование диска
df -h

# Использование сети
iftop
```

## Контакты и поддержка

При возникновении проблем с развертыванием:
1. Проверьте логи приложения и Apache
2. Убедитесь, что все зависимости установлены
3. Проверьте конфигурационные файлы на наличие ошибок
4. Обратитесь к документации проекта на GitHub