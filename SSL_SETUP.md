# Настройка SSL для BizStartMaster

## Обзор

Данное руководство описывает настройку SSL-сертификата с использованием Let's Encrypt для BizStartMaster на Ubuntu сервере с Apache.

## Требования

- Зарегистрированное доменное имя
- VPS сервер с Ubuntu 20.04+
- Настроенный Apache (согласно основному руководству по развертыванию)
- Доступ к серверу по SSH с правами sudo

## Шаг 1: Установка Certbot

```bash
# Обновление системы
sudo apt update

# Установка Certbot и Apache плагина
sudo apt install certbot python3-certbot-apache -y
```

## Шаг 2: Получение SSL-сертификата

### Вариант 1: Автоматическая настройка (рекомендуется)

```bash
# Получение и автоматическая настройка сертификата
sudo certbot --apache -d your-domain.com -d www.your-domain.com
```

Certbot задаст несколько вопросов:
1. Email для уведомлений о продлении
2. Согласие с условиями использования
3. Подписка на рассылку (можно отказаться)
4. Настройка перенаправления HTTP на HTTPS (рекомендуется выбрать вариант 2)

### Вариант 2: Только получение сертификата

```bash
# Получение сертификата без автоматической настройки
sudo certbot certonly --apache -d your-domain.com -d www.your-domain.com
```

## Шаг 3: Обновление конфигурации Apache

После автоматической настройки Certbot создаст файлы:
- `/etc/apache2/sites-available/your-domain.com-le-ssl.conf` - конфигурация HTTPS
- `/etc/apache2/sites-available/your-domain.com.conf` - обновленная конфигурация HTTP

### Ручная настройка (если использовали вариант 2)

Обновите файл `/etc/apache2/sites-available/bizstartmaster.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAdmin admin@your-domain.com
    
    # Перенаправление на HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    ServerAdmin admin@your-domain.com
    
    # Базовая директория проекта
    DocumentRoot /var/www/bizstartmaster/dist/public
    
    # SSL конфигурация
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    
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
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # Сжатие
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css text/javascript application/javascript application/xml+rss application/json
</VirtualHost>
```

## Шаг 4: Обновление переменных окружения

Обновите файл `.env.production`:

```env
# Обновите CORS_ORIGIN для HTTPS
CORS_ORIGIN=https://your-domain.com

# Обновите клиентские переменные
VITE_AI_API_URL=https://your-domain.com/api/ai
```

## Шаг 5: Перезапуск сервисов

```bash
# Перезапуск Apache
sudo systemctl restart apache2

# Перезапуск приложения для применения новых переменных окружения
sudo systemctl restart bizstartmaster
```

## Шаг 6: Проверка SSL

### Проверка сертификата
```bash
# Проверка статуса сертификата
sudo certbot certificates

# Проверка конфигурации Apache
sudo apache2ctl configtest
```

### Проверка в браузере
1. Откройте `https://your-domain.com`
2. Убедитесь, что браузер показывает замок
3. Проверьте, что HTTP перенаправляет на HTTPS

### Онлайн проверка
Используйте сервисы для проверки SSL:
- SSL Labs: https://www.ssllabs.com/ssltest/
- Qualys SSL Test

## Автоматическое продление сертификата

Let's Encrypt сертификаты действительны 90 дней. Certbot автоматически настраивает продление.

### Проверка автоматического продления
```bash
# Проверка настроенной задачи cron
sudo systemctl list-timers | grep certbot

# Тестовое продление
sudo certbot renew --dry-run
```

### Ручное продление
```bash
# Ручное продление всех сертификатов
sudo certbot renew

# Продление конкретного сертификата
sudo certbot renew --cert-name your-domain.com
```

## Усиление безопасности SSL

### Обновление конфигурации Apache

Добавьте в конфигурацию HTTPS следующие директивы:

```apache
# Усиление SSL
SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
SSLCipherSuite HIGH:!aNULL:!MD5:!3DES
SSLHonorCipherOrder on
SSLCompression off

# Заголовки безопасности
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com"
```

### Настройка Diffie-Hellman параметров

```bash
# Создание сильных DH параметров
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

# Добавление в конфигурацию Apache
SSLOpenSSLConfCmd DHParameters "/etc/ssl/certs/dhparam.pem"
```

## Мониторинг SSL

### Настройка уведомлений

Certbot автоматически отправляет уведомления на email, указанный при регистрации.

### Скрипт мониторинга

Создайте скрипт `/usr/local/bin/monitor-ssl.sh`:

```bash
#!/bin/bash

DOMAIN="your-domain.com"
DAYS_WARNING=30

# Получение даты истечения сертификата
EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)

# Конвертация даты в секунды
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)

# Расчет дней до истечения
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt $DAYS_WARNING ]; then
    echo "WARNING: SSL certificate for $DOMAIN expires in $DAYS_LEFT days ($EXPIRY_DATE)"
    # Здесь можно добавить отправку email или уведомления
fi
```

Сделайте скрипт исполняемым и добавьте в cron:
```bash
sudo chmod +x /usr/local/bin/monitor-ssl.sh

# Добавьте в cron для ежедневной проверки
echo "0 8 * * * /usr/local/bin/monitor-ssl.sh" | sudo crontab -
```

## Устранение проблем

### Проблема: Сертификат не получен

**Причина**: DNS настройки или проблемы с доступом к серверу

**Решение**:
```bash
# Проверка DNS
nslookup your-domain.com

# Проверка доступности порта 80
telnet your-domain.com 80

# Проверка логов Apache
sudo tail -f /var/log/apache2/error.log
```

### Проблема: Apache не запускается после настройки SSL

**Причина**: Ошибка в конфигурации SSL

**Решение**:
```bash
# Проверка конфигурации
sudo apache2ctl configtest

# Просмотр логов ошибок
sudo tail -f /var/log/apache2/error.log

# Временное отключение SSL
sudo a2dissite your-domain.com-le-ssl.conf
sudo systemctl restart apache2
```

### Проблема: Смешанное содержимое (Mixed Content)

**Причина**: HTTP ресурсы на HTTPS странице

**Решение**:
1. Обновите все URL в коде с HTTP на HTTPS
2. Используйте относительные URL
3. Обновите переменные окружения

### Проблема: Сертификат не продлевается

**Причина**: Проблемы с автоматическим продлением

**Решение**:
```bash
# Тестовое продление
sudo certbot renew --dry-run

# Проверка логов certbot
sudo journalctl -u certbot
sudo cat /var/log/letsencrypt/letsencrypt.log

# Ручное продление
sudo certbot renew --force-renewal
```

## Обновление проекта с SSL

При обновлении проекта не забывайте:

1. **Перезапускать Apache** после изменений конфигурации
2. **Обновлять переменные окружения** при изменении домена
3. **Проверять работу HTTPS** после каждого обновления
4. **Мониторить срок действия** сертификата

## Альтернативные варианты SSL

### Cloudflare SSL

Если используете Cloudflare:

1. Настройте Cloudflare для вашего домена
2. Выберите режим "Full" или "Full (Strict)"
3. Обновите DNS записи
4. Настройте Origin Certificate на сервере

### Платный SSL

Для платных сертификатов (Comodo, Symantec и др.):

1. Купите сертификат у провайдера
2. Сгенерируйте CSR на сервере
3. Установите сертификат по инструкции провайдера
4. Обновите конфигурацию Apache

## Дополнительные ресурсы

- [Официальная документация Certbot](https://certbot.eff.org/docs/)
- [SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [Let's Encrypt Community](https://community.letsencrypt.org/)
- [Apache SSL/TLS Strong Configuration](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-scan-docs-v3.md#apache-ssltls-strong-configuration)