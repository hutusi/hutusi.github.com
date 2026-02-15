# hutusi.com Deployment Guide (Refactored)

This guide provides instructions for deploying the static site to a remote Linux server.

## Features of the Refactored Setup

- **Canonical Redirects**: Automatically redirects `www.hutusi.com` to `hutusi.com`.
- **HTTPS & HTTP/2**: Pre-configured for secure, fast delivery.
- **Security Headers**: Includes HSTS, XSS protection, and Content Security Policy.
- **Optimized Caching**: Long-term caching for hashed Next.js assets (`_next/static`).
- **Robust Deployment**: Improved `deploy.sh` with dry-run support and dependency checks.

## Prerequisites

1.  **Local Machine**: `npm`, `rsync`, `ssh`.
2.  **Remote Server**: Nginx, Certbot (for Let's Encrypt).

## Deployment Steps

1.  **First-time Server Setup**:
    Ensure the web root exists and has correct permissions:
    ```bash
    ssh user@your_server_ip "sudo mkdir -p /var/www/hutusi && sudo chown -R \$USER:\$USER /var/www/hutusi"
    ```

2.  **Generate SSL Certificates**:
    If you haven't already, run Certbot on the server:
    ```bash
    sudo certbot --nginx -d hutusi.com -d www.hutusi.com
    ```

3.  **Run Deployment**:
    Use the `deploy.sh` script from your local machine:
    ```bash
    # Basic deployment
    REMOTE_USER=myuser REMOTE_HOST=1.2.3.4 ./deploy.sh

    # Dry run (see what happens without changing anything)
    ./deploy.sh --dry-run

    # Skip build if you already ran it manually
    ./deploy.sh --skip-build
    ```

## Customization

- **Domain Name**: Replace `hutusi.com` in `server_nginx.conf` and `deploy.sh` with your own domain if it differs.
- **Paths**: The default root is `/var/www/hutusi`. You can change `DIR` in `deploy.sh`.

## Nginx Configuration Details

The configuration is located in `server_nginx.conf`. It is automatically uploaded to `/etc/nginx/sites-available/hutusi.com` and symlinked to `sites-enabled/`.
