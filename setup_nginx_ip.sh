#!/bin/bash

# 🌐 Настройка Nginx для IP (открываем по IP без домена)

IP="193.233.85.240" # Ваш IP
PORT=5000

# Цвета
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🔧 Настраиваю Nginx для доступа по IP: $IP...${NC}"

# 1. Создание конфига
sudo tee /etc/nginx/sites-available/bizstart_ip > /dev/null <<EOF
server {
    listen 80;
    server_name $IP;

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

# 2. Активация
sudo ln -sf /etc/nginx/sites-available/bizstart_ip /etc/nginx/sites-enabled/

# 3. Удаляем старые конфиги (на всякий случай, чтобы не конфликтовали)
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/bizstart 

# 4. Перезагрузка
echo -e "${GREEN}🔄 Перезагружаю Nginx...${NC}"
sudo nginx -t && sudo systemctl restart nginx

echo -e "${GREEN}✅ Готово! Пробуйте открыть: http://$IP${NC}"
