#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
# Print every command before it is executed for detailed logging.
set -ex

# This script is run by CodeDeploy as the root user.

# Navigate into the application directory where CodeDeploy copied the files.
cd /home/ec2-user/app

# Recursively set the ownership of all files in this directory to the ec2-user.
# This is critical because the files are initially placed by the root user.
chown -R ec2-user:ec2-user .

# Now, switch to the 'ec2-user' to run all Node.js/NPM/PM2 commands.
# This is a security best practice and ensures the app runs with the correct environment.
# The `su - ec2-user -c '...'` command runs everything inside the single quotes as that user.
su - ec2-user -c '
  # Source the NVM script to add node, npm, and pm2 to the PATH.
  export NVM_DIR="/home/ec2-user/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  
  # Navigate to the app directory again (this is required within the new shell).
  cd /home/ec2-user/app

  # Install only production dependencies.
  npm install --omit=dev

  # Use PM2 to start the app using a configuration file.
  # startOrRestart will gracefully restart the app if it is already running.
  pm2 startOrRestart ecosystem.config.js
'