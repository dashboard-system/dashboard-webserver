#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# Define the app directory
APP_DIR="/home/ec2-user/app"

# Create the app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
fi