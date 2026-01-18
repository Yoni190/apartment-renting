#!/bin/bash
# Enable PHP PDO extensions for MySQL and SQLite

echo "Enabling PHP PDO extensions..."
sudo sed -i 's/;extension=pdo_mysql/extension=pdo_mysql/' /etc/php/php.ini
sudo sed -i 's/;extension=pdo_sqlite/extension=pdo_sqlite/' /etc/php/php.ini

echo "Verifying extensions are enabled..."
php -m | grep -i pdo

echo ""
echo "Done! You can now run migrations."
echo "For MySQL: cd web && php artisan migrate"
echo "For SQLite: cd external-services && php artisan migrate"
