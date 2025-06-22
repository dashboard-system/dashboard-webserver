#!/bin/bash
set -e

# Use the full, absolute path to pm2
/home/ec2-user/.nvm/versions/node/v20.19.2/bin/pm2 stop app || true
/home/ec2-user/.nvm/versions/node/v20.19.2/bin/pm2 delete app || true