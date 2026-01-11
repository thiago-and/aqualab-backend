#!/bin/sh

echo "Waiting for database..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Database is up!"
