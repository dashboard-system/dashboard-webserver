#!/binin/bash
set -e

# Stop and delete the old app version from PM2
# The '|| true' ensures the script doesn't fail if the app isn't running
pm2 stop app || true
pm2 delete app || true