#!/bin/bash
set -e  # exit immediately if a command fails

# Load .env if needed
export $(grep -v '^#' .env | xargs)

echo "Pulling latest changes from Git..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Deploy finished successfully."
