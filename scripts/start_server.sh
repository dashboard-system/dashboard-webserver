#!/bin/bash
set -e

# --- FIX: Add these lines to load NVM ---
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# --- End of FIX ---

# The rest of the script remains the same
cd /home/ec2-user/app

npm install --omit=dev

# IMPORTANT: Change 'dist/index.js' if your server entry point is different
pm2 start dist/index.js --name app