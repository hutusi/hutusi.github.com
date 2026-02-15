#!/bin/bash

# hutusi.com Deployment Script
# Refactored for Bun, password support, and robust permissions

set -e # Exit on error

# Detect directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Default Configuration
USER=""
HOST=""
PASS=""
DIR="/var/www/hutusi"
NGINX_SRC="$SCRIPT_DIR/server_nginx.conf"
NGINX_DEST="/etc/nginx/sites-available/hutusi.com"

# Help message
show_help() {
    echo "Usage: ./deployment/deploy.sh [options]"
    echo ""
    echo "Options:"
    echo "  -h, --host HOST      Remote host IP or domain"
    echo "  -u, --user USER      Remote SSH user"
    echo "  -p, --pass PASS      Remote SSH password (optional, SSH keys recommended)"
    echo "  --setup-nginx        Update Nginx configuration on the remote server"
    echo "  --dry-run            Show what would be done without actually doing it"
    echo "  --skip-build         Skip the bun build step"
    echo "  --help               Show this help message"
    echo ""
    echo "Environment Variables (fallback):"
    echo "  REMOTE_USER, REMOTE_HOST, REMOTE_PASS"
}

# Parse arguments
DRY_RUN=false
SKIP_BUILD=false
SETUP_NGINX=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host) HOST="$2"; shift 2 ;;
        -u|--user) USER="$2"; shift 2 ;;
        -p|--pass) PASS="$2"; shift 2 ;;
        --setup-nginx) SETUP_NGINX=true; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        --skip-build) SKIP_BUILD=true; shift ;;
        --help) show_help; exit 0 ;;
        *) shift ;;
    esac
done

# Fallback to env vars
USER=${USER:-$REMOTE_USER}
HOST=${HOST:-$REMOTE_HOST}
PASS=${PASS:-$REMOTE_PASS}

if [ -z "$HOST" ] || [ -z "$USER" ]; then
    error "Host and User are required. Use --host and --user or set REMOTE_HOST and REMOTE_USER."
fi

# Dependency check
check_dep() {
    if ! command -v $1 &> /dev/null; then
        error "$1 is not installed but required."
    fi
}

check_dep bun
check_dep rsync
check_dep ssh

# Setup SSH and Rsync commands
if [ -n "$PASS" ]; then
    check_dep sshpass
    export SSHPASS="$PASS"
    SSH_OPTS="-o StrictHostKeyChecking=no -o PreferredAuthentications=password,publickey"
    SSH_BASE="sshpass -e ssh $SSH_OPTS"
    SCP_BASE="sshpass -e scp $SSH_OPTS"
    RSYNC_SSH="sshpass -e ssh $SSH_OPTS"
    warn "Using password for authentication. Using SSH keys is highly recommended for security."
else
    SSH_OPTS="-o StrictHostKeyChecking=no"
    SSH_BASE="ssh $SSH_OPTS"
    SCP_BASE="scp $SSH_OPTS"
    RSYNC_SSH="ssh $SSH_OPTS"
fi

# Check connectivity before building
log "Checking SSH connectivity..."
if ! $SSH_BASE -o ConnectTimeout=10 $USER@$HOST "exit" 2>/dev/null; then
    error "Could not connect to $USER@$HOST. Please check your credentials and server status."
fi
success "Connected successfully."

# 1. Build
if [ "$SKIP_BUILD" = false ]; then
    log "Starting build process with Bun..."
    if [ "$DRY_RUN" = true ]; then
        log "[DRY-RUN] bun run build"
    else
        cd "$PROJECT_ROOT" && bun run build
    fi
    success "Build completed."
else
    log "Skipping build step."
fi

# Determine if we need sudo
REMOTE_SUDO="sudo"
if [ "$USER" = "root" ]; then
    REMOTE_SUDO=""
fi

# 2. Sync files
log "Deploying files to $USER@$HOST:$DIR..."
if [ "$DRY_RUN" = true ]; then
    log "[DRY-RUN] Syncing $PROJECT_ROOT/out/ to $USER@$HOST:$DIR"
else
    # Ensure the remote directory exists
    $SSH_BASE $USER@$HOST "$REMOTE_SUDO mkdir -p $DIR && $REMOTE_SUDO chown -R $USER:$USER $DIR"
    
    # Sync files
    if [ -n "$PASS" ]; then
        # Use sshpass to wrap the whole rsync command for better reliability with special chars
        sshpass -e rsync -avz --delete -e "ssh $SSH_OPTS" "$PROJECT_ROOT/out/" "$USER@$HOST:$DIR/"
    else
        rsync -avz --delete -e "ssh $SSH_OPTS" "$PROJECT_ROOT/out/" "$USER@$HOST:$DIR/"
    fi
fi
success "Files synced."

# 3. Nginx Configuration
if [ "$SETUP_NGINX" = true ]; then
    log "Updating Nginx configuration..."
    if [ "$DRY_RUN" = true ]; then
        log "[DRY-RUN] Update Nginx config at $NGINX_DEST"
    else
        $SCP_BASE "$NGINX_SRC" $USER@$HOST:/tmp/hutusi.nginx.conf
        $SSH_BASE $USER@$HOST << EOF
            $REMOTE_SUDO mv /tmp/hutusi.nginx.conf $NGINX_DEST
            $REMOTE_SUDO ln -sf $NGINX_DEST /etc/nginx/sites-enabled/
            
            # Check SSL certificates
            if [ ! -f /etc/letsencrypt/live/hutusi.com/fullchain.pem ]; then
                echo -e "${RED}[WARN]${NC} SSL certificates not found at expected path."
            fi

            if $REMOTE_SUDO nginx -t; then
                $REMOTE_SUDO systemctl reload nginx
                echo "Nginx reloaded successfully."
            else
                echo -e "${RED}[ERROR]${NC} Nginx configuration test failed. Not reloaded."
                exit 1
            fi
EOF
    fi
else
    log "Skipping Nginx configuration (use --setup-nginx to enable)."
fi

success "Deployment to $HOST finished successfully!"
