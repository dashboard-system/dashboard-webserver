#!/bin/bash
set -e

cd /home/ec2-user/app

# Install production dependencies
npm install --omit=dev

# Start the new application with PM2
# IMPORTANT: Change 'dist/index.js' to your actual server entry point if it's different
pm2 start dist/index.js --name app