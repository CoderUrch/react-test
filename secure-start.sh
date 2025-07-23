#!/bin/bash

SECRET_ID=prod/3tier/db-creds

# Export secrets from AWS
export DB_HOST=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --query 'SecretString' --output text | jq -r .DB_HOST)
export DB_PORT=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --query 'SecretString' --output text | jq -r .DB_PORT)
export DB_USER=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --query 'SecretString' --output text | jq -r .DB_USER)
export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --query 'SecretString' --output text | jq -r .DB_PASSWORD)
export DB_NAME=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --query 'SecretString' --output text | jq -r .DB_NAME)

# ✅ Use envsubst to substitute variables before Compose parses them
envsubst < docker-compose.yml | docker compose up --build -d
