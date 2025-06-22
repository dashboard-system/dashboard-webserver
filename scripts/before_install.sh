#!/bin/bash
set -e

# Define the application directory
APP_DIR="/home/ec2-user/app"

# If the application directory exists from a previous deployment, remove it and all its contents
if [ -d "$APP_DIR" ]; then
    echo "Removing existing application directory: ${APP_DIR}"
    rm -rf "${APP_DIR}"
fi

# Create a fresh, empty application directory for the new deployment
echo "Creating fresh application directory: ${APP_DIR}"
mkdir -p "${APP_DIR}"