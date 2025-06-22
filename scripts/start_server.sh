#!/bin/bash
set -e

cd /home/ec2-user/app

# Use the absolute path to npm to install dependencies
/home/ec2-user/.nvm/versions/node/v20.19.2/bin/npm install --omit=dev

# Use the absolute path to pm2 to start the application
# Remember to change 'dist/index.js' if your main file is different
/home/ec2-user/.nvm/versions/node/v20.19.2/bin/pm2 start dist/index.js --name app