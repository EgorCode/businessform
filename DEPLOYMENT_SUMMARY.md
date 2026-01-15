# Сводка по развертыванию BizStartMaster

## Обзор

Данный документ предоставляет полную сводку по развертыванию проекта BizStartMaster на VPS сервере с Ubuntu и Apache.

## Архитектура проекта

### Технологический стек
- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **База данных**: SQLite + Drizzle ORM
- **AI-интеграция**: Google Gemini API
- **Веб-сервер**: Apache (в качестве обратного прокси)
- **Процесс-менеджер**: systemd

### Структура приложения
```
/var/www/bizstartmaster/
├── client/                 # Frontend код
├── server/                 # Backend код
├── shared/                 # Общие типы и схемы
├── dist/                   # Собранное приложение
├── local.db               # База данных SQLite
├── .env.production        # Production конфигурация
└── package.json           # Зависимости проекта
```

## Полный процесс развертывания

### Шаг 1: Подготовка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимого ПО
sudo apt install apache2 git build-essential -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Настройка Apache
sudo a2enmod proxy proxy_http headers rewrite
sudo systemctl restart apache2
```

### Шаг 2: Развертывание приложения
```bash
# Создание директории и клонирование
sudo mkdir -p /var/www/bizstartmaster
cd /var/www/bizstartmaster
sudo git clone <REPOSITORY_URL> .
sudo chown -R www-data:www-data /var/www/bizstartmaster

# Установка и сборка
sudo -u www-data npm install
sudo -u www-data npm run build
sudo -u www-data npm run db:init
```

### Шаг 3: Конфигурация окружения
Создать `.env.production` с необходимыми переменными:
- `NODE_ENV=production`
- `PORT=5000`
- `DATABASE_URL=sqlite:./local.db`
- `SESSION_SECRET` (надежный ключ)
- `GEMINI_API_KEY` (API ключ)
- `CORS_ORIGIN` (IP или домен сервера)

### Шаг 4: Настройка Apache
Создать VirtualHost конфигурацию с проксированием:
- Статические файлы обслуживаются Apache
- API запросы проксируются на Node.js (порт 5000)
- Настроены заголовки безопасности и сжатие

### Шаг 5: Настройка systemd сервиса
Создать сервис для управления Node.js приложением:
- Автоматический запуск при загрузке
- Перезапуск при сбоях
- Логирование в systemd journal

### Шаг 6: Тестирование и проверка
- Проверка статуса сервисов
- Проверка доступности приложения
- Проверка работы AI функциональности

## Конфигурационные файлы

### Основные файлы
1. **`.env.production`** - Переменные окружения
2. **`/etc/apache2/sites-available/bizstartmaster.conf`** - Apache конфигурация
3. **`/etc/systemd/system/bizstartmaster.service`** - systemd сервис
4. **`/usr/local/bin/backup-bizstartmaster.sh`** - Скрипт резервного копирования
5. **`/usr/local/bin/monitor-bizstartmaster.sh`** - Скрипт мониторинга

### Дополнительные файлы
- **`/etc/logrotate.d/bizstartmaster`** - Ротация логов
- **`/etc/cron.d/bizstartmaster`** - Планировщик задач
- **`/var/backups/bizstartmaster/`** - Директория для бэкапов

## Мониторинг и логирование

### Источники логов
1. **Systemd journal**: `sudo journalctl -u bizstartmaster`
2. **Apache access**: `/var/log/apache2/bizstartmaster_access.log`
3. **Apache error**: `/var/log/apache2/bizstartmaster_error.log`
4. **Мониторинг**: `/var/log/bizstartmaster-monitor.log`

### Метрики мониторинга
- Статус сервиса systemd
- Использование CPU, памяти, диска
- Доступность health endpoint
- Статистика AI кэша

### Алерты
- Высокая загрузка CPU (>80%)
- Высокое использование памяти (>80%)
- Мало места на диске (<10%)
 Недоступность сервиса

## Безопасность

### Меры безопасности
1. **Защита API**: Rate limiting, валидация запросов
2. **Заголовки безопасности**: X-Frame-Options, X-Content-Type-Options
3. **Изоляция процессов**: Запуск от пользователя www-data
4. **Минимальные привилегии**: Только необходимые права доступа
5. **Регулярные обновления**: Системные пакеты и зависимости

### Рекомендации
- Использовать надежные пароли и SSH ключи
- Настроить firewall (ufw)
- Регулярно делать резервные копии
- Мониторить логи на предмет подозрительной активности

## Резервное копирование

### Что копируется
1. **База данных SQLite**: Ежедневно
2. **Логи**: Ежедневно с ротацией
3. **Конфигурационные файлы**: При изменениях

### Хранение бэкапов
- Локальное хранение: 7 дней
- Удаленное хранение: рекомендуется настроить
- Сжатие: gzip для экономии места

## Обновление проекта

### Процесс обновления
1. Остановить сервис: `sudo systemctl stop bizstartmaster`
2. Получить изменения: `sudo -u www-data git pull`
3. Установить зависимости: `sudo -u www-data npm install`
4. Собрать проект: `sudo -u www-data npm run build`
5. Применить миграции: `sudo -u www-data npm run db:push`
6. Запустить сервис: `sudo systemctl start bizstartmaster`

### Автоматизация
- Скрипт `/usr/local/bin/deploy-bizstartmaster.sh`
- Возможность настройки CI/CD

## Производительность

### Оптимизация
1. **Apache**: Кэширование статических файлов, сжатие
2. **Node.js**: Кэширование AI ответов, rate limiting
3. **SQLite**: Регулярная оптимизация (VACUUM, ANALYZE)
4. **Сеть**: CDN для статических ресурсов (опционально)

### Мониторинг производительности
- Время ответа API
- Загрузка сервера
- Использование AI API
- Эффективность кэша

## SSL/HTTPS

### Настройка (опционально)
1. Установка Certbot
2. Получение сертификата Let's Encrypt
3. Настройка Apache для HTTPS
4. Обновление переменных окружения
5. Настройка перенаправления HTTP → HTTPS

### Усиление безопасности
- Современные протоколы TLS
- Сильные шифры
- HSTS заголовки
- CSP политики

## Устранение проблем

### Частые проблемы
1. **Сервис не запускается**: Проверить логи, права доступа, конфигурацию
2. **Ошибка 502**: Проверить, запущен ли Node.js процесс
3. **Проблемы с БД**: Проверить права доступа к файлу БД
4. **AI не работает**: Проверить API ключ, доступ к Gemini API

### Диагностика
```bash
# Статус сервисов
sudo systemctl status bizstartmaster apache2

# Логи приложения
sudo journalctl -u bizstartmaster -n 50

# Логи Apache
sudo tail -f /var/log/apache2/bizstartmaster_error.log

# Проверка портов
sudo netstat -tlnp | grep -E ':(80|443|5000)'

# Проверка процессов
ps aux | grep -E '(node|apache)'
```

## Документация

### Основные документы
1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Подробное руководство
2. **[QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)** - Быстрое развертывание
3. **[PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md)** - Конфигурационные файлы
4. **[SSL_SETUP.md](./SSL_SETUP.md)** - Настройка SSL
5. **[MONITORING.md](./MONITORING.md)** - Мониторинг и логирование

### Дополнительная документация
- **[README.md](./README.md)** - Общая информация о проекте
- **[AI_INTEGRATION_SUMMARY.md](./AI_INTEGRATION_SUMMARY.md)** - AI функциональность
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Архитектура проекта

## Чек-лист развертывания

### Перед развертыванием
- [ ] Подготовлен VPS сервер с Ubuntu
- [ ] Настроен доступ по SSH с правами sudo
- [ ] Подготовлен репозиторий с кодом
- [ ] Получен API ключ для Google Gemini

### Развертывание
- [ ] Установлены системные зависимости
- [ ] Склонирован репозиторий проекта
- [ ] Установлены зависимости Node.js
- [ ] Собран проект
- [ ] Настроена база данных
- [ ] Создан файл окружения
- [ ] Настроен Apache VirtualHost
- [ ] Создан systemd сервис
- [ ] Запущены сервисы

### После развертывания
- [ ] Проверена работа приложения
- [ ] Настроено резервное копирование
- [ ] Настроен мониторинг
- [ ] Проверены логи
- [ ] Настроен firewall
- [ ] Протестирована AI функциональность

### Опционально
- [ ] Настроен SSL сертификат
- [ ] Настроен домен
- [ ] Настроен CDN
- [ ] Настроено удаленное бэкапирование
- [ ] Настроены алерты

## Поддержка и обслуживание

### Регулярные задачи
- **Ежедневно**: Проверка логов, мониторинг ресурсов
- **Еженедельно**: Обновление системы, проверка бэкапов
- **Ежемесячно**: Обновление зависимостей, оптимизация БД
- **Ежеквартально**: Аудит безопасности, тестирование восстановления

### Контактная информация
- Администратор: admin@your-domain.com
- Документация: https://github.com/your-repo/bizstartmaster
- Поддержка: support@your-domain.com

## Заключение

Данное руководство предоставляет полную информацию для развертывания и поддержки BizStartMaster в production-окружении. Следуйте инструкциям последовательно и не пропускайте шаги настройки безопасности и мониторинга.

При возникновении проблем обращайтесь к разделу устранения неполадок или к дополнительной документации проекта.