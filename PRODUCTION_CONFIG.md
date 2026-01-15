# Production конфигурация для BizStartMaster

## Файлы конфигурации для production-окружения

### 1. Файл окружения (.env.production)

Создайте файл `.env.production` в корневой директории проекта со следующим содержимым:

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

**Важно:** Замените следующие значения:
- `your-very-secure-secret-key-here-change-in-production` - сгенерируйте надежный секретный ключ
- `your_gemini_api_key_here` - ваш API ключ от Google Gemini
- `http://your-server-ip` - IP адрес вашего сервера

### 2. Apache VirtualHost конфигурация

Создайте файл `/etc/apache2/sites-available/bizstartmaster.conf` со следующим содержимым:

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

### 3. Systemd сервис для Node.js приложения

Создайте файл `/etc/systemd/system/bizstartmaster.service` со следующим содержимым:

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

### 4. Скрипт резервного копирования базы данных

Создайте файл `/usr/local/bin/backup-bizstartmaster.sh` со следующим содержимым:

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

### 5. Конфигурация ротации логов

Создайте файл `/etc/logrotate.d/bizstartmaster` со следующим содержимым:

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

### 6. Скрипт автоматического развертывания

Создайте файл `/usr/local/bin/deploy-bizstartmaster.sh` со следующим содержимым:

```bash
#!/bin/bash

set -e

echo "Starting BizStartMaster deployment..."

# Переход в директорию проекта
cd /var/www/bizstartmaster

# Остановка сервиса
echo "Stopping BizStartMaster service..."
sudo systemctl stop bizstartmaster

# Получение обновлений
echo "Pulling latest changes..."
sudo -u www-data git pull origin main

# Установка новых зависимостей
echo "Installing dependencies..."
sudo -u www-data npm install

# Сборка проекта
echo "Building project..."
sudo -u www-data npm run build

# Применение миграций базы данных
echo "Applying database migrations..."
sudo -u www-data npm run db:push

# Запуск сервиса
echo "Starting BizStartMaster service..."
sudo systemctl start bizstartmaster

# Проверка статуса
echo "Checking service status..."
sudo systemctl status bizstartmaster --no-pager

echo "Deployment completed successfully!"
```

### 7. Скрипт установки зависимостей сервера

Создайте файл `/usr/local/bin/setup-bizstartmaster-server.sh` со следующим содержимым:

```bash
#!/bin/bash

set -e

echo "Setting up BizStartMaster server..."

# Обновление системы
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Установка Apache
echo "Installing Apache..."
sudo apt install apache2 -y

# Установка Node.js 18.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Git
echo "Installing Git..."
sudo apt install git -y

# Установка дополнительных пакетов
echo "Installing additional packages..."
sudo apt install build-essential -y

# Настройка Apache
echo "Configuring Apache..."
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite
sudo systemctl restart apache2
sudo systemctl enable apache2

# Создание директории для проекта
echo "Creating project directory..."
sudo mkdir -p /var/www/bizstartmaster
sudo chown -R www-data:www-data /var/www/bizstartmaster
sudo chmod -R 755 /var/www/bizstartmaster

# Создание директории для бэкапов
echo "Creating backup directory..."
sudo mkdir -p /var/backups/bizstartmaster
sudo chown -R www-data:www-data /var/backups/bizstartmaster

echo "Server setup completed!"
echo "Now you can:"
echo "1. Clone your repository to /var/www/bizstartmaster"
echo "2. Configure Apache VirtualHost"
echo "3. Setup systemd service"
echo "4. Deploy your application"
```

## Инструкции по применению конфигурации

### Шаг 1: Подготовка сервера
```bash
# Сделайте скрипты исполняемыми
sudo chmod +x /usr/local/bin/setup-bizstartmaster-server.sh
sudo chmod +x /usr/local/bin/deploy-bizstartmaster.sh
sudo chmod +x /usr/local/bin/backup-bizstartmaster.sh

# Запустите установку сервера
sudo /usr/local/bin/setup-bizstartmaster-server.sh
```

### Шаг 2: Развертывание проекта
```bash
# Клонируйте репозиторий
cd /var/www/bizstartmaster
sudo git clone <REPOSITORY_URL> .

# Настройте окружение
sudo cp .env.production .env.production
sudo nano .env.production  # отредактируйте значения

# Запустите развертывание
sudo /usr/local/bin/deploy-bizstartmaster.sh
```

### Шаг 3: Настройка Apache
```bash
# Активируйте сайт
sudo a2dissite 000-default.conf
sudo a2ensite bizstartmaster.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### Шаг 4: Настройка systemd сервиса
```bash
# Перезагрузите systemd и запустите сервис
sudo systemctl daemon-reload
sudo systemctl start bizstartmaster
sudo systemctl enable bizstartmaster
```

### Шаг 5: Настройка резервного копирования
```bash
# Добавьте в cron для ежедневного выполнения
sudo crontab -e
# Добавьте строку:
# 0 2 * * * /usr/local/bin/backup-bizstartmaster.sh
```

## Проверка работоспособности

После развертывания проверьте:

1. **Статус сервиса**:
   ```bash
   sudo systemctl status bizstartmaster
   ```

2. **Логи приложения**:
   ```bash
   sudo journalctl -u bizstartmaster -f
   ```

3. **Логи Apache**:
   ```bash
   sudo tail -f /var/log/apache2/bizstartmaster_access.log
   sudo tail -f /var/log/apache2/bizstartmaster_error.log
   ```

4. **Доступность приложения**:
   Откройте в браузере `http://your-server-ip`

## Безопасность

### Рекомендации по безопасности

1. **Сгенерируйте надежный SESSION_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

2. **Настройте firewall**:
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   ```

3. **Регулярно обновляйте систему**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Используйте SSH ключи** вместо паролей

5. **Мониторьте логи** на предмет подозрительной активности

### Мониторинг

Для мониторинга производительности и доступности рекомендуется:

1. **Настроить мониторинг ресурсов**:
   ```bash
   # Установка htop для мониторинга CPU и памяти
   sudo apt install htop
   
   # Использование
   htop
   ```

2. **Настроить оповещения** о недоступности сервиса

3. **Регулярно проверять логи ошибок**

## Обновление проекта

Для обновления проекта до новой версии:

```bash
# Запустите скрипт развертывания
sudo /usr/local/bin/deploy-bizstartmaster.sh

# Или выполните вручную:
cd /var/www/bizstartmaster
sudo systemctl stop bizstartmaster
sudo -u www-data git pull origin main
sudo -u www-data npm install
sudo -u www-data npm run build
sudo -u www-data npm run db:push
sudo systemctl start bizstartmaster
```

## Восстановление из резервной копии

В случае необходимости восстановления базы данных:

```bash
# Остановите сервис
sudo systemctl stop bizstartmaster

# Восстановите базу данных из последней резервной копии
sudo cp /var/backups/bizstartmaster/local_YYYYMMDD_HHMMSS.db /var/www/bizstartmaster/local.db

# Установите правильные права
sudo chown www-data:www-data /var/www/bizstartmaster/local.db

# Запустите сервис
sudo systemctl start bizstartmaster