#!/bin/sh

echo "Waiting for database..."

until mysqladmin ping \
  -h"$DB_HOST" \
  -P"$DB_PORT" \
  -u"$DB_USER" \
  -p"$DB_PASSWORD" \
  --silent; do
  sleep 1
done

echo "Database is up!"
