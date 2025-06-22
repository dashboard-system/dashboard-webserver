#!/bin/bash

set -ex

APP_DIR="/home/ec2-user/app"

echo "--- BeforeInstall script started ---"
echo "Running as user: $(whoami)"
echo "Attempting to clean directory: ${APP_DIR}"

if [ -d "$APP_DIR" ]; then
    echo "Directory ${APP_DIR} exists. Forcibly removing it with root privileges..."
   
    sudo rm -rfv "${APP_DIR}"
    echo "Directory removal command finished."
else
    echo "Directory ${APP_DIR} does not exist. No need to remove."
fi

echo "Creating a fresh, empty application directory..."
mkdir -p "${APP_DIR}"

chown ec2-user:ec2-user "${APP_DIR}"
echo "Directory creation finished."

echo "--- BeforeInstall script completed successfully ---"