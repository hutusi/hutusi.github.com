#!/bin/bash

# hutusi.com Deployment Script
# Refactored for robustness and better DX

set -e # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Default Configuration
USER=${REMOTE_USER:-"user"}
HOST=${REMOTE_HOST:-"your_server_ip"}
DIR="/var/www/hutusi"
NGINX_SRC="server_nginx.conf"
NGINX_DEST="/etc/nginx/sites-available/hutusi.com"

# Help message
show_help() {
    echo "Usage: ./deploy.sh [options]"
    echo ""
    echo "Options:"
    echo "  --dry-run    Show what would be done without actually doing it"
    echo "  --skip-build Skip the npm build step"
    echo "  --help       Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  REMOTE_USER  SSH username (default: $USER)"
    echo "  REMOTE_HOST  SSH host/IP (default: $HOST)"
}

# Parse arguments
DRY_RUN=false
SKIP_BUILD=false

for arg in "$@"; do
    case $arg in
        --dry-run) DRY_RUN=true; shift ;;
        --skip-build) SKIP_BUILD=true; shift ;;
        --help) show_help; exit 0 ;;
    esac
done

# Dependency check
check_dep() {
    if ! command -v $1 &> /dev/null; then
        error "$1 is not installed but required."
    fi
}

check_dep npm
check_dep rsync
check_dep ssh

# 1. Build
if [ "$SKIP_BUILD" = false ]; then
    log "Starting build process..."
    if [ "$DRY_RUN" = true ]; then
        log "[DRY-RUN] npm run build"
    else
        npm run build
    fi
    success "Build completed."
else
    log "Skipping build step."
fi

# 2. Sync files
log "Deploying files to $USER@$HOST:$DIR..."
if [ "$DRY_RUN" = true ]; then
    log "[DRY-RUN] rsync -avz --delete out/ $USER@$HOST:$DIR"
else
    # Create directory if it doesn't exist
    ssh $USER@$HOST "sudo mkdir -p $DIR && sudo chown -R $USER:$USER $DIR"
    rsync -avz --delete out/ $USER@$HOST:$DIR
fi
success "Files synced."

# 3. Nginx Configuration
log "Updating Nginx configuration..."
if [ "$DRY_RUN" = true ]; then
    log "[DRY-RUN] Update Nginx config at $NGINX_DEST"
else
    scp $NGINX_SRC $USER@$HOST:/tmp/hutusi.nginx.conf
    ssh $USER@$HOST << EOF
        sudo mv /tmp/hutusi.nginx.conf $NGINX_DEST
        sudo ln -sf $NGINX_DEST /etc/nginx/sites-enabled/
        
        # Check SSL certificates
        if [ ! -f /etc/letsencrypt/live/hutusi.com/fullchain.pem ]; then
            echo -e "${RED}[WARN]${NC} SSL certificates not found. Run certbot!"
        fi

        if sudo nginx -t; then
            sudo systemctl reload nginx
            echo "Nginx reloaded successfully."
        else
            echo -e "${RED}[ERROR]${NC} Nginx configuration test failed. Not reloaded."
            exit 1
        fi
EOF
fi

success "Deployment to $HOST finished successfully!"
