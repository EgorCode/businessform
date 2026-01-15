#!/bin/bash

# 🌐 Настройка Nginx для вашего домена

DOMAIN=$1
PORT=5000

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️ Использование: ./setup_nginx.sh ваша-ссылка.com${NC}"
    echo -e "Пример: ./setup_nginx.sh businessform.xorek.cloud"
    exit 1
fi

echo -e "${GREEN}🔧 Устанавливаю и настраиваю Nginx для $DOMAIN...${NC}"

# 1. Загрузка Nginx
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 2. Создание конфига
# Используем tee, чтобы записать файл с sudo правами
sudo tee /etc/nginx/sites-available/bizstart > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 3. Активация сайта
sudo ln -sf /etc/nginx/sites-available/bizstart /etc/nginx/sites-enabled/
# Удаляем дефолтный сайт, чтобы не мешал (если это новый сервер)
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Проверка и перезагрузка
echo -e "${GREEN}🔄 Перезагружаю Nginx...${NC}"
sudo nginx -t && sudo systemctl restart nginx

# 5. Настройка Firewall (UFW)
echo -e "${GREEN}shield Настраиваю Firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000  # На всякий случай

# 6. SSL (HTTPS) - опционально
echo -e "${YELLOW}🔒 Хотите подключить бесплатный SSL сертификат (HTTPS) через Let's Encrypt? (y/n)${NC}"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d $DOMAIN
fi

echo -e "${GREEN}✅ Готово! Ваш сайт должен быть доступен по адресу: http://$DOMAIN${NC}"
