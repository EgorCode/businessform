#!/bin/bash

# =============================================================================
# Скрипт полного развертывания BizStartMaster на VPS Ubuntu 22
# Автор: AI Assistant
# Версия: 1.0
# =============================================================================

set -e  # Прерывать выполнение при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода цветных сообщений
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка прав root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Этот скрипт должен быть запущен с правами root (sudo)"
        exit 1
    fi
}

# Получение параметров
get_parameters() {
    # Параметры с значениями по умолчанию
    REPO_URL=${1:-"https://github.com/your-username/bizstartmaster.git"}
    DOMAIN=${2:-"localhost"}
    EMAIL=${3:-"admin@localhost"}
    GEMINI_API_KEY=${4:-""}
    
    log_info "Параметры развертывания:"
    log_info "  Репозиторий: $REPO_URL"
    log_info "  Домен/IP: $DOMAIN"
    log_info "  Email администратора: $EMAIL"
    
    if [[ -z "$GEMINI_API_KEY" ]]; then
        log_warning "API ключ Gemini не указан. AI-функциональность будет ограничена."
        read -p "Хотите указать Gemini API ключ сейчас? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Введите Gemini API ключ: " GEMINI_API_KEY
        fi
    fi
}

# Обновление системы
update_system() {
    log_info "Обновление системы..."
    apt update && apt upgrade -y
    log_success "Система обновлена"
}

# Установка системных зависимостей
install_dependencies() {
    log_info "Установка системных зависимостей..."
    
    # Установка Apache2
    apt install apache2 -y
    
    # Установка Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    # Установка Git и других утилит
    apt install git build-essential unzip curl wget -y
    
    log_success "Зависимости установлены"
}

# Настройка firewall
setup_firewall() {
    log_info "Настройка firewall..."
    
    # Включение UFW
    ufw --force enable
    
    # Разрешение необходимых портов
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    log_success "Firewall настроен"
}

# Настройка Apache2
setup_apache() {
    log_info "Настройка Apache2..."
    
    # Включение модулей
    a2enmod proxy
    a2enmod proxy_http
    a2enmod headers
    a2enmod rewrite
    a2enmod deflate
    a2enmod ssl
    
    # Отключение сайта по умолчанию
    a2dissite 000-default.conf
    
    # Создание конфигурации виртуального хоста
    cat > /etc/apache2/sites-available/bizstartmaster.conf << EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAdmin $EMAIL
    
    # Базовая директория проекта
    DocumentRoot /var/www/bizstartmaster/dist/public
    
    # Логи
    ErrorLog \${APACHE_LOG_DIR}/bizstartmaster_error.log
    CustomLog \${APACHE_LOG_DIR}/bizstartmaster_access.log combined
    
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
EOF

    # Активация сайта
    a2ensite bizstartmaster.conf
    
    # Проверка конфигурации
    apache2ctl configtest
    
    # Перезапуск Apache
    systemctl restart apache2
    systemctl enable apache2
    
    log_success "Apache2 настроен"
}

# Развертывание приложения
deploy_application() {
    log_info "Развертывание приложения..."
    
    # Создание директории проекта
    mkdir -p /var/www/bizstartmaster
    cd /var/www/bizstartmaster
    
    # Клонирование репозитория
    log_info "Клонирование репозитория..."
    git clone $REPO_URL .
    
    # Установка прав доступа
    chown -R www-data:www-data /var/www/bizstartmaster
    chmod -R 755 /var/www/bizstartmaster
    
    # Установка зависимостей
    log_info "Установка зависимостей Node.js..."
    sudo -u www-data npm install
    
    # Сборка проекта
    log_info "Сборка проекта..."
    sudo -u www-data npm run build
    
    log_success "Приложение развернуто"
}

# Настройка переменных окружения
setup_environment() {
    log_info "Настройка переменных окружения..."
    
    cd /var/www/bizstartmaster
    
    # Генерация секретного ключа
    SESSION_SECRET=$(openssl rand -base64 32)
    
    # Создание production-файла окружения
    cat > .env.production << EOF
# Database configuration
DATABASE_URL=sqlite:./local.db

# Server configuration
PORT=5000
NODE_ENV=production

# Session configuration
SESSION_SECRET=$SESSION_SECRET

# Google Gemini API Configuration
GEMINI_API_KEY=$GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash-preview-09-2025
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# AI Service Configuration
AI_CACHE_TTL=300000        # 5 минут в мс
AI_RATE_LIMIT=100          # запросов в час
AI_MAX_TOKENS=800         # максимальное количество токенов
AI_TEMPERATURE=0.7         # температура генерации

# Security
CORS_ORIGIN=http://$DOMAIN
API_KEY_HEADER=X-API-Key

# Client-side environment variables
VITE_AI_API_URL=/api/ai
VITE_AI_API_KEY=demo-key
EOF

    # Установка прав доступа
    chown www-data:www-data .env.production
    chmod 600 .env.production
    
    log_success "Переменные окружения настроены"
}

# Инициализация базы данных
init_database() {
    log_info "Инициализация базы данных..."
    
    cd /var/www/bizstartmaster
    
    # Инициализация базы данных
    sudo -u www-data npm run db:init
    
    # Инициализация новостных категорий
    sudo -u www-data npx tsx scripts/db-init-news.ts
    
    log_success "База данных инициализирована"
}

# Создание systemd сервиса
create_systemd_service() {
    log_info "Создание systemd сервиса..."
    
    cat > /etc/systemd/system/bizstartmaster.service << EOF
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
EOF

    # Перезагрузка systemd и запуск сервиса
    systemctl daemon-reload
    systemctl start bizstartmaster
    systemctl enable bizstartmaster
    
    log_success "Systemd сервис создан и запущен"
}

# Настройка резервного копирования
setup_backup() {
    log_info "Настройка резервного копирования..."
    
    # Создание скрипта бэкапа
    cat > /usr/local/bin/backup-bizstartmaster.sh << 'EOF'
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
EOF

    # Сделать скрипт исполняемым
    chmod +x /usr/local/bin/backup-bizstartmaster.sh
    
    # Добавление в cron для ежедневного выполнения в 2:00
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-bizstartmaster.sh") | crontab -
    
    log_success "Резервное копирование настроено"
}

# Настройка ротации логов
setup_log_rotation() {
    log_info "Настройка ротации логов..."
    
    cat > /etc/logrotate.d/bizstartmaster << EOF
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
EOF

    log_success "Ротация логов настроена"
}

# Проверка работы сервиса
check_service() {
    log_info "Проверка работы сервиса..."
    
    # Проверка статуса
    if systemctl is-active --quiet bizstartmaster; then
        log_success "Сервис bizstartmaster запущен"
    else
        log_error "Сервис bizstartmaster не запущен"
        systemctl status bizstartmaster
        exit 1
    fi
    
    # Проверка API
    sleep 5
    if curl -s http://localhost:5000/api/ai/health > /dev/null; then
        log_success "API отвечает на запросы"
    else
        log_warning "API не отвечает на запросы, проверьте логи"
    fi
}

# Создание скрипта обновления
create_update_script() {
    log_info "Создание скрипта обновления..."
    
    cat > /usr/local/bin/update-bizstartmaster.sh << 'EOF'
#!/bin/bash

echo "Обновление BizStartMaster..."

cd /var/www/bizstartmaster

# Остановка сервиса
systemctl stop bizstartmaster

# Получение обновлений
sudo -u www-data git pull origin main

# Установка новых зависимостей
sudo -u www-data npm install

# Сборка проекта
sudo -u www-data npm run build

# Применение миграций базы данных
sudo -u www-data npm run db:push

# Запуск сервиса
systemctl start bizstartmaster

# Проверка статуса
systemctl status bizstartmaster

echo "Обновление завершено"
EOF

    # Сделать скрипт исполняемым
    chmod +x /usr/local/bin/update-bizstartmaster.sh
    
    log_success "Скрипт обновления создан"
}

# Вывод итоговой информации
show_completion_info() {
    log_success "Развертывание завершено!"
    
    echo ""
    echo "============================================="
    echo "ИНФОРМАЦИЯ О РАЗВЕРТЫВАНИИ"
    echo "============================================="
    echo "Приложение доступно по адресу: http://$DOMAIN"
    echo "API доступно по адресу: http://$DOMAIN/api"
    echo ""
    echo "Полезные команды:"
    echo "  Проверка статуса сервиса: systemctl status bizstartmaster"
    echo "  Просмотр логов: journalctl -u bizstartmaster -f"
    echo "  Перезапуск сервиса: systemctl restart bizstartmaster"
    echo "  Обновление приложения: update-bizstartmaster.sh"
    echo "  Резервное копирование: backup-bizstartmaster.sh"
    echo ""
    echo "Файлы конфигурации:"
    echo "  Apache: /etc/apache2/sites-available/bizstartmaster.conf"
    echo "  Сервис: /etc/systemd/system/bizstartmaster.service"
    echo "  Окружение: /var/www/bizstartmaster/.env.production"
    echo ""
    echo "Директория проекта: /var/www/bizstartmaster"
    echo "============================================="
}

# Основная функция
main() {
    log_info "Начало развертывания BizStartMaster..."
    
    # Проверка прав
    check_root
    
    # Получение параметров
    get_parameters "$@"
    
    # Выполнение шагов развертывания
    update_system
    install_dependencies
    setup_firewall
    setup_apache
    deploy_application
    setup_environment
    init_database
    create_systemd_service
    setup_backup
    setup_log_rotation
    create_update_script
    check_service
    show_completion_info
    
    log_success "Развертывание успешно завершено!"
}

# Запуск основной функции
main "$@"