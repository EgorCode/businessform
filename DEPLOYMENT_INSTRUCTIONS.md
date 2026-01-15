# Инструкция по развертыванию BizStartMaster

## Быстрое начало

### 1. Подготовка сервера

Убедитесь, что у вас есть:
- VPS сервер с Ubuntu 20.04+ 
- Доступ по SSH с правами sudo
- URL репозитория проекта

### 2. Запуск развертывания

```bash
# Скачайте и запустите скрипт одной командой
curl -sSL https://raw.githubusercontent.com/your-repo/bizstartmaster/main/deploy.sh | sudo bash

# Или скачайте сначала
wget https://raw.githubusercontent.com/your-repo/bizstartmaster/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

### 3. С параметрами

```bash
sudo ./deploy.sh "REPO_URL" "DOMAIN" "EMAIL" "GEMINI_API_KEY"
```

Пример:
```bash
sudo ./deploy.sh "https://github.com/user/bizstartmaster.git" "mysite.com" "admin@mysite.com" "AIzaSy..."
```

## Что происходит во время развертывания

1. **Обновление системы** - установка последних обновлений
2. **Установка ПО** - Apache2, Node.js 18.x, Git
3. **Настройка firewall** - открытие необходимых портов
4. **Настройка Apache** - конфигурация виртуального хоста
5. **Развертывание** - клонирование, установка зависимостей, сборка
6. **Настройка БД** - инициализация SQLite базы данных
7. **Создание сервиса** - systemd для автозапуска
8. **Бэкапы** - настройка резервного копирования

## После развертывания

### Проверка работы
```bash
# Статус сервиса
systemctl status bizstartmaster

# Проверка API
curl http://your-domain.com/api/ai/health

# Просмотр логов
journalctl -u bizstartmaster -f
```

### Обновление приложения
```bash
# Запуск обновления
sudo update-bizstartmaster.sh
```

### Резервное копирование
```bash
# Ручной бэкап
sudo backup-bizstartmaster.sh

# Бэкапы автоматически создаются ежедневно в 2:00
# Хранятся в /var/backups/bizstartmaster/
```

## Полезные команды

```bash
# Перезапуск сервиса
sudo systemctl restart bizstartmaster

# Перезапуск Apache
sudo systemctl restart apache2

# Проверка конфигурации Apache
sudo apache2ctl configtest

# Просмотр логов Apache
sudo tail -f /var/log/apache2/bizstartmaster_access.log
sudo tail -f /var/log/apache2/bizstartmaster_error.log
```

## Настройка SSL (рекомендуется)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-apache

# Получение сертификата
sudo certbot --apache -d your-domain.com
```

## Файлы конфигурации

- **Apache**: `/etc/apache2/sites-available/bizstartmaster.conf`
- **Сервис**: `/etc/systemd/system/bizstartmaster.service`
- **Окружение**: `/var/www/bizstartmaster/.env.production`
- **Проект**: `/var/www/bizstartmaster`

## Устранение проблем

### Сервис не запускается
```bash
# Проверка статуса и логов
sudo systemctl status bizstartmaster
sudo journalctl -u bizstartmaster -n 50
```

### Ошибки Apache
```bash
# Проверка конфигурации
sudo apache2ctl configtest

# Просмотр ошибок
sudo tail -f /var/log/apache2/bizstartmaster_error.log
```

### Проблемы с БД
```bash
cd /var/www/bizstartmaster
sudo -u www-data npm run db:check
```

## Безопасность

1. **Регулярные обновления**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Настройка firewall** (уже настроен скриптом):
   ```bash
   sudo ufw status
   ```

3. **Используйте надежные пароли** и SSH ключи

4. **Настройте SSL** для работы по HTTPS

5. **Мониторьте логи** регулярно

## Дополнительная информация

- **Полная документация**: [DEPLOYMENT_SCRIPT.md](./DEPLOYMENT_SCRIPT.md)
- **Руководство по развертыванию**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Быстрое развертывание**: [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)

## Поддержка

При возникновении проблем:
1. Проверьте логи приложения и Apache
2. Убедитесь, что все зависимости установлены
3. Проверьте конфигурационные файлы
4. Обратитесь к документации проекта