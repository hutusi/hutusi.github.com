#!/bin/bash

# Configuration
REMOTE_USER=${REMOTE_USER:-"user"}
REMOTE_HOST=${REMOTE_HOST:-"your_server_ip"}
REMOTE_DIR="/var/www/hutusi"
NGINX_CONFIG_SRC="server_nginx.conf"
NGINX_CONFIG_DEST="/etc/nginx/sites-available/hutusi.com"

# Build the project
echo "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Exiting."
    exit 1
fi

echo "Build successful."

# Ensure remote directory exists
echo "Creating remote directory..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo mkdir -p $REMOTE_DIR && sudo chown -R $REMOTE_USER:$REMOTE_USER $REMOTE_DIR"

# Sync files
echo "Syncing files to remote server..."
rsync -avz --delete out/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# Upload Nginx config
echo "Uploading Nginx configuration..."
scp $NGINX_CONFIG_SRC $REMOTE_USER@$REMOTE_HOST:/tmp/hutusi.nginx.conf

# Configure Nginx on remote
echo "Configuring Nginx on remote server..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
    sudo mv /tmp/hutusi.nginx.conf $NGINX_CONFIG_DEST
    sudo ln -sf $NGINX_CONFIG_DEST /etc/nginx/sites-enabled/
    
    # Check for SSL certs - simplified check
    if [ ! -f /etc/letsencrypt/live/hutusi.com/fullchain.pem ]; then
        echo "WARNING: SSL certificates not found at expected path."
        echo "Please install certbot and run: sudo certbot --nginx -d hutusi.com"
    fi

    sudo nginx -t && sudo systemctl reload nginx
    echo "Nginx reloaded."
EOF

echo "Deployment complete!"
