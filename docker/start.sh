#!/usr/bin/env bash
set -e

php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    SQLITE_DATABASE="${DB_DATABASE:-database/database.sqlite}"

    if [ "${SQLITE_DATABASE#/}" = "$SQLITE_DATABASE" ]; then
        SQLITE_DATABASE="/var/www/html/${SQLITE_DATABASE}"
    fi

    mkdir -p "$(dirname "$SQLITE_DATABASE")"
    touch "$SQLITE_DATABASE"
fi

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
