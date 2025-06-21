#!/bin/bash
set -e

# --- FIX: Add these lines to load NVM ---
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# --- End of FIX ---

# The rest of the script remains the same
pm2 stop app || true
pm2 delete app || true