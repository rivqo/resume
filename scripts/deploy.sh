#!/bin/bash
set -e

echo "Pulling latest code..."
git reset --hard
git clean -fd
git pull origin main

echo "Rebuilding Docker image..."
docker compose down
docker compose build
docker compose up -d

echo "Deployment complete ✅"