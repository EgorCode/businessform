# Мониторинг и логирование BizStartMaster

## Обзор

Данное руководство описывает настройку мониторинга и логирования для BizStartMaster в production-окружении.

## Встроенные средства мониторинга

### 1. Логи приложения

BizStartMaster использует несколько уровней логирования:

#### Systemd логи
```bash
# Просмотр логов в реальном времени
sudo journalctl -u bizstartmaster -f

# Просмотр последних 100 строк
sudo journalctl -u bizstartmaster -n 100

# Просмотр логов за определенный период
sudo journalctl -u bizstartmaster --since "2024-01-01" --until "2024-01-02"
```

#### Apache логи
```bash
# Логи доступа
sudo tail -f /var/log/apache2/bizstartmaster_access.log

# Логи ошибок
sudo tail -f /var/log/apache2/bizstartmaster_error.log

# Поиск ошибок в логах
sudo grep "error" /var/log/apache2/bizstartmaster_error.log
```

### 2. Health check эндпоинт

Приложение предоставляет health check эндпоинт для мониторинга состояния:

```bash
# Проверка состояния AI сервиса
curl http://localhost:5000/api/ai/health

# Пример ответа
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "gemini": {
    "configured": true,
    "apiKey": "configured"
  },
  "cache": {
    "size": 15,
    "hitRate": 85.5,
    "totalRequests": 150,
    "cacheHits": 128
  }
}
```

## Расширенный мониторинг

### 1. Мониторинг системных ресурсов

#### Установка инструментов мониторинга
```bash
# Установка htop для мониторинга CPU и памяти
sudo apt install htop

# Установка iotop для мониторинга диска
sudo apt install iotop

# Установка nethogs для мониторинга сети
sudo apt install nethogs

# Установка sysstat для системной статистики
sudo apt install sysstat
sudo systemctl enable sysstat
```

#### Использование инструментов
```bash
# Мониторинг CPU и памяти в реальном времени
htop

# Мониторинг дисковой активности
sudo iotop

# Мониторинг сетевой активности по процессам
sudo nethogs

# Просмотр загрузки CPU за день
sar -u

# Просмотр использования памяти
sar -r

# Просмотр статистики диска
sar -d
```

### 2. Мониторинг производительности приложения

#### Создание скрипта мониторинга
Создайте файл `/usr/local/bin/monitor-bizstartmaster.sh`:

```bash
#!/bin/bash

# Конфигурация
LOG_FILE="/var/log/bizstartmaster-monitor.log"
ALERT_EMAIL="admin@your-domain.com"
THRESHOLD_CPU=80
THRESHOLD_MEMORY=80
THRESHOLD_DISK=90

# Функция логирования
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Функция отправки алерта
send_alert() {
    local subject="BizStartMaster Alert: $1"
    local message="$2"
    
    # Отправка email (настройте mailutils или другой агент)
    echo "$message" | mail -s "$subject" $ALERT_EMAIL
    
    # Логирование алерта
    log_message "ALERT: $subject - $message"
}

# Проверка загрузки CPU
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    local cpu_int=${cpu_usage%.*}
    
    if [ $cpu_int -gt $THRESHOLD_CPU ]; then
        send_alert "High CPU Usage" "CPU usage is ${cpu_usage}% (threshold: ${THRESHOLD_CPU}%)"
    fi
    
    log_message "CPU Usage: ${cpu_usage}%"
}

# Проверка использования памяти
check_memory() {
    local memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    local memory_int=${memory_usage%.*}
    
    if [ $memory_int -gt $THRESHOLD_MEMORY ]; then
        send_alert "High Memory Usage" "Memory usage is ${memory_usage}% (threshold: ${THRESHOLD_MEMORY}%)"
    fi
    
    log_message "Memory Usage: ${memory_usage}%"
}

# Проверка дискового пространства
check_disk() {
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $disk_usage -gt $THRESHOLD_DISK ]; then
        send_alert "Low Disk Space" "Disk usage is ${disk_usage}% (threshold: ${THRESHOLD_DISK}%)"
    fi
    
    log_message "Disk Usage: ${disk_usage}%"
}

# Проверка статуса сервиса
check_service() {
    if ! systemctl is-active --quiet bizstartmaster; then
        send_alert "Service Down" "BizStartMaster service is not running"
        log_message "Service Status: DOWN"
    else
        log_message "Service Status: RUNNING"
    fi
}

# Проверка доступности приложения
check_application() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/ai/health)
    
    if [ "$response" != "200" ]; then
        send_alert "Application Unavailable" "Health check failed with HTTP code: $response"
        log_message "Application Status: UNAVAILABLE (HTTP $response)"
    else
        log_message "Application Status: AVAILABLE"
    fi
}

# Основной цикл мониторинга
main() {
    log_message "Starting monitoring check"
    
    check_cpu
    check_memory
    check_disk
    check_service
    check_application
    
    log_message "Monitoring check completed"
}

# Запуск
main
```

Сделайте скрипт исполняемым:
```bash
sudo chmod +x /usr/local/bin/monitor-bizstartmaster.sh
```

#### Настройка cron для автоматического мониторинга
```bash
# Добавление в cron для выполнения каждые 5 минут
sudo crontab -e
```

Добавьте строку:
```
*/5 * * * * /usr/local/bin/monitor-bizstartmaster.sh
```

### 3. Мониторинг логов с Logrotate

Создайте файл `/etc/logrotate.d/bizstartmaster-app`:

```
/var/log/bizstartmaster-monitor.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload bizstartmaster
    endscript
}
```

### 4. Настройка Grafana и Prometheus (опционально)

#### Установка Prometheus
```bash
# Добавление репозитория Prometheus
sudo apt-get install -y prometheus

# Создание конфигурации для BizStartMaster
sudo nano /etc/prometheus/prometheus.yml
```

Добавьте в конфигурацию:
```yaml
scrape_configs:
  - job_name: 'bizstartmaster'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

#### Установка Grafana
```bash
# Добавление репозитория Grafana
sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list

sudo apt-get update
sudo apt-get install -y grafana

# Запуск сервисов
sudo systemctl start prometheus
sudo systemctl enable prometheus
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

## Логирование

### 1. Структура логов

#### Логи приложения
- **Systemd**: `/var/log/syslog` (фильтр по bizstartmaster)
- **Apache Access**: `/var/log/apache2/bizstartmaster_access.log`
- **Apache Error**: `/var/log/apache2/bizstartmaster_error.log`
- **Мониторинг**: `/var/log/bizstartmaster-monitor.log`

#### Уровни логирования
- **ERROR**: Критические ошибки, требующие немедленного внимания
- **WARN**: Предупреждения о потенциальных проблемах
- **INFO**: Информационные сообщения о работе приложения
- **DEBUG**: Отладочная информация (только в разработке)

### 2. Централизованное логирование

#### Настройка rsyslog для централизации логов
Создайте файл `/etc/rsyslog.d/bizstartmaster.conf`:

```
# Фильтрация логов BizStartMaster
if $programname == 'bizstartmaster' then /var/log/bizstartmaster.log
& stop

# Отправка на удаленный сервер (опционально)
# *.* @@log-server.example.com:514
```

Перезапустите rsyslog:
```bash
sudo systemctl restart rsyslog
```

### 3. Анализ логов

#### Поиск ошибок в логах
```bash
# Поиск ошибок в логах приложения
sudo journalctl -u bizstartmaster | grep -i error

# Поиск ошибок в логах Apache
sudo grep -i error /var/log/apache2/bizstartmaster_error.log

# Поиск предупреждений
sudo journalctl -u bizstartmaster | grep -i warn

# Статистика HTTP кодов
sudo awk '{print $9}' /var/log/apache2/bizstartmaster_access.log | sort | uniq -c | sort -nr
```

#### Анализ производительности через логи
```bash
# Топ 10 самых медленных запросов
sudo awk '{print $7, $10}' /var/log/apache2/bizstartmaster_access.log | sort -k2 -nr | head -10

# Статистика по времени ответа
sudo awk '{print $10}' /var/log/apache2/bizstartmaster_access.log | awk '{sum+=$1; count++} END {print "Average:", sum/count, "ms"}'

# Анализ IP адресов
sudo awk '{print $1}' /var/log/apache2/bizstartmaster_access.log | sort | uniq -c | sort -nr | head -10
```

## Алерты и уведомления

### 1. Настройка email уведомлений

#### Установка mailutils
```bash
sudo apt install mailutils
```

#### Настройка Gmail (опционально)
```bash
# Создание файла конфигурации
sudo nano /etc/ssmtp/ssmtp.conf
```

Содержимое файла:
```
root=your-email@gmail.com
mailhub=smtp.gmail.com:587
AuthUser=your-email@gmail.com
AuthPass=your-app-password
UseSTARTTLS=YES
```

### 2. Настройка Slack уведомлений

#### Создание скрипта для Slack
Создайте файл `/usr/local/bin/slack-notify.sh`:

```bash
#!/bin/bash

WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
MESSAGE="$1"

curl -X POST -H 'Content-type: application/json' \
--data "{\"text\":\"$MESSAGE\"}" \
$WEBHOOK_URL
```

Интеграция с мониторингом:
```bash
# В скрипте мониторинга добавьте:
send_slack_alert() {
    /usr/local/bin/slack-notify.sh "BizStartMaster Alert: $1"
}
```

### 3. Настройка Telegram уведомлений

#### Создание скрипта для Telegram
Создайте файл `/usr/local/bin/telegram-notify.sh`:

```bash
#!/bin/bash

BOT_TOKEN="YOUR_BOT_TOKEN"
CHAT_ID="YOUR_CHAT_ID"
MESSAGE="$1"

curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
-d "chat_id=$CHAT_ID" \
-d "text=$MESSAGE"
```

## Резервное копирование логов

### 1. Архивирование логов
Создайте скрипт `/usr/local/bin/backup-logs.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/bizstartmaster-logs"
DATE=$(date +%Y%m%d)
RETENTION_DAYS=30

# Создание директории
mkdir -p $BACKUP_DIR

# Архивирование логов Apache
tar -czf $BACKUP_DIR/apache-$DATE.tar.gz /var/log/apache2/bizstartmaster_*.log

# Архивирование логов приложения
journalctl -u bizstartmaster --since "1 day ago" > $BACKUP_DIR/bizstartmaster-$DATE.log

# Удаление старых бэкапов
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.log" -mtime +$RETENTION_DAYS -delete

echo "Log backup completed: $BACKUP_DIR"
```

### 2. Настройка cron для резервного копирования
```bash
# Добавление в cron для ежедневного выполнения в 3:00
echo "0 3 * * * /usr/local/bin/backup-logs.sh" | sudo crontab -
```

## Производительность и оптимизация

### 1. Мониторинг производительности Node.js

#### Установка clinic.js
```bash
sudo npm install -g clinic
```

#### Профилирование приложения
```bash
# Профилирование CPU
cd /var/www/bizstartmaster
sudo -u www-data clinic doctor -- node dist/index.js

# Профилирование памяти
sudo -u www-data clinic heapprofiler -- node dist/index.js

# Профилирование Flamegraph
sudo -u www-data clinic flame -- node dist/index.js
```

### 2. Оптимизация базы данных SQLite

#### Анализ производительности БД
```bash
# Проверка статистики БД
cd /var/www/bizstartmaster
sqlite3 local.db ".schema"
sqlite3 local.db "PRAGMA table_info(users);"

# Оптимизация БД
sqlite3 local.db "VACUUM;"
sqlite3 local.db "ANALYZE;"
```

### 3. Мониторинг AI сервиса

#### Статистика использования AI
```bash
# Просмотр статистики кэша
curl http://localhost:5000/api/ai/health | jq '.cache'

# Мониторинг запросов к AI API
sudo journalctl -u bizstartmaster | grep "Gemini API"
```

## Безопасность логов

### 1. Ограничение доступа к логам
```bash
# Установка прав доступа
sudo chmod 640 /var/log/bizstartmaster*.log
sudo chown root:adm /var/log/bizstartmaster*.log

# Настройка logrotate для безопасной ротации
sudo nano /etc/logrotate.d/bizstartmaster-secure
```

### 2. Шифрование логов (опционально)
```bash
# Создание GPG ключа для шифрования
gpg --gen-key

# Шифрование логов перед отправкой
gpg --trust-model always --encrypt -r recipient@email.com /var/log/bizstartmaster.log
```

## Диагностика проблем

### 1. Чек-лист диагностики

#### Приложение не отвечает
```bash
# 1. Проверка статуса сервиса
sudo systemctl status bizstartmaster

# 2. Проверка логов
sudo journalctl -u bizstartmaster -n 50

# 3. Проверка порта
sudo netstat -tlnp | grep :5000

# 4. Проверка процессов
ps aux | grep node

# 5. Проверка ресурсов
htop
df -h
```

#### Медленная работа приложения
```bash
# 1. Проверка загрузки CPU
top -p $(pgrep -f "node dist/index.js")

# 2. Проверка памяти
free -h

# 3. Проверка дисковой активности
sudo iotop

# 4. Анализ медленных запросов
sudo awk '$10 > 1000 {print $7, $10}' /var/log/apache2/bizstartmaster_access.log
```

#### Проблемы с AI сервисом
```bash
# 1. Проверка health endpoint
curl http://localhost:5000/api/ai/health

# 2. Проверка API ключа
sudo journalctl -u bizstartmaster | grep "Gemini API"

# 3. Проверка кэша
curl http://localhost:5000/api/ai/health | jq '.cache'
```

## Дополнительные ресурсы

- [Systemd Journal Documentation](https://www.freedesktop.org/software/systemd/man/journalctl.html)
- [Apache Logging Documentation](https://httpd.apache.org/docs/2.4/logs.html)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [SQLite Performance Analysis](https://www.sqlite.org/lang_analyze.html)