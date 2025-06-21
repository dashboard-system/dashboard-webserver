#!/bin/bash
set -e

# --- FIX: Add these lines to load NVM ---
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# --- End of FIX ---

# The rest of the script remains the same
APP_DIR="/home/ec2-user/app"

if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
fi