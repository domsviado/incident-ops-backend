#!/bin/bash

echo "Pulling latest code..."
git reset --hard
git pull origin main

echo "Installing dependencies..."
npm install

echo "Restarting backend..."
pm2 restart incident-ops-backend
