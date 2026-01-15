# Быстрое развертывание BizStartMaster

## Краткая инструкция для быстрого развертывания на VPS сервере с Ubuntu

### Предварительные требования
- VPS сервер с Ubuntu 20.04+
- Доступ к серверу по SSH с правами sudo
- Репозиторий с проектом

### Шаг 1: Подготовка сервера (одной командой)

```bash
# Скачайте и выполните скрипт настройки сервера
curl -sSL https://raw.githubusercontent.com/your-repo/bizstartmaster/main/scripts/setup-server.sh | bash
```

Или выполните вручную:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Apache, Node.js, Git
sudo apt install apache2 git build-essential -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Настройка Apache
sudo a2enmod proxy proxy_http headers rewrite
sudo systemctl restart apache2
```

### Шаг 2: Развертывание проекта

```bash
# Создание директории и клонирование проекта
sudo mkdir -p /var/www/bizstartmaster
cd /var/www/bizstartmaster
sudo git clone <REPOSITORY_URL> .
sudo chown -R www-data:www-data /var/www/bizstartmaster

# Установка зависимостей и сборка
sudo -u www-data npm install
sudo -u www-data npm run build
sudo -u www-data npm run db:init
```

### Шаг 3: Конфигурация окружения

```bash
# Создание production-файла окружения
sudo nano .env.production
```

Добавьте содержимое:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=sqlite:./local.db
SESSION_SECRET=your-secure-secret-key
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGIN=http://your-server-ip
VITE_AI_API_URL=/api/ai
```

### Шаг 4: Настройка Apache

```bash
# Создание конфигурации сайта
sudo tee /etc/apache2/sites-available/bizstartmaster.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName your-server-ip
    DocumentRoot /var/www/bizstartmaster/dist/public
    
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
    
    <Directory /var/www/bizstartmaster/dist/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    AddOutputFilterByType DEFLATE text/plain text/html text/css application/javascript application/json
</VirtualHost>
EOF

# Активация сайта
sudo a2dissite 000-default.conf
sudo a2ensite bizstartmaster.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### Шаг 5: Настройка systemd сервиса

```bash
# Создание сервиса
sudo tee /etc/systemd/system/bizstartmaster.service > /dev/null <<EOF
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

[Install]
WantedBy=multi-user.target
EOF

# Запуск сервиса
sudo systemctl daemon-reload
sudo systemctl start bizstartmaster
sudo systemctl enable bizstartmaster
```

### Шаг 6: Проверка

```bash
# Проверка статуса сервиса
sudo systemctl status bizstartmaster

# Проверка логов
sudo journalctl -u bizstartmaster -n 20

# Проверка доступности
curl http://localhost:5000/api/ai/health
```

### Шаг 7: Настройка резервного копирования

```bash
# Создание скрипта бэкапа
sudo tee /usr/local/bin/backup-bizstartmaster.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/bizstartmaster"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /var/www/bizstartmaster/local.db $BACKUP_DIR/local_$DATE.db
find $BACKUP_DIR -name "local_*.db" -mtime +7 -delete
echo "Backup completed: $BACKUP_DIR/local_$DATE.db"
EOF

sudo chmod +x /usr/local/bin/backup-bizstartmaster.sh

# Добавление в cron
echo "0 2 * * * /usr/local/bin/backup-bizstartmaster.sh" | sudo crontab -
```

## Готово!

Приложение должно быть доступно по адресу: `http://your-server-ip`

## Обновление проекта

```bash
cd /var/www/bizstartmaster
sudo systemctl stop bizstartmaster
sudo -u www-data git pull origin main
sudo -u www-data npm install
sudo -u www-data npm run build
sudo -u www-data npm run db:push
sudo systemctl start bizstartmaster
```

## Полезные команды

```bash
# Просмотр логов приложения
sudo journalctl -u bizstartmaster -f

# Просмотр логов Apache
sudo tail -f /var/log/apache2/bizstartmaster_access.log
sudo tail -f /var/log/apache2/bizstartmaster_error.log

# Перезапуск сервисов
sudo systemctl restart bizstartmaster
sudo systemctl restart apache2

# Проверка статуса
sudo systemctl status bizstartmaster
sudo systemctl status apache2
```

## Безопасность

```bash
# Настройка firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Генерация секретного ключа
openssl rand -base64 32
```

## Поиск проблем

### Приложение не запускается
```bash
sudo systemctl status bizstartmaster
sudo journalctl -u bizstartmaster -n 50
```

### Ошибки Apache
```bash
sudo apache2ctl configtest
sudo tail -f /var/log/apache2/bizstartmaster_error.log
```

### Проблемы с базой данных
```bash
cd /var/www/bizstartmaster
sudo -u www-data npm run db:check
```

## Следующие шаги

1. **Настройте SSL сертификат** (Let's Encrypt)
2. **Настройте мониторинг** производительности
3. **Настройте оповещения** о недоступности
4. **Регулярно делайте резервные копии**
5. **Следите за обновлениями** безопасности

## Подробная документация

Для более подробной информации см.:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - полное руководство по развертыванию
- [PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md) - конфигурационные файлы
- [README.md](./README.md) - информация о проекте