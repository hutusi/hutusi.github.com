# hutusi.com Deployment Guide

This guide provides instructions for deploying the static site to a remote Linux server.

## Features

- **Canonical Redirects**: Automatically redirects `www.hutusi.com` to `hutusi.com`.
- **HTTPS & HTTP/2**: Pre-configured for secure, fast delivery.
- **Security Headers**: Includes HSTS, XSS protection, and CSP.
- **Optimized Caching**: Long-term caching for Next.js assets.
- **Robust Deployment**: Script with dry-run support and dependency checks.

## Deployment Steps

1.  **Generate SSL Certificates**:
    If you haven't already, run Certbot on the server:
    ```bash
    sudo certbot --nginx -d hutusi.com -d www.hutusi.com
    ```

2.  **Run Deployment**:
    Use the `deploy.sh` script. You can run it via `npm` or directly:

    ```bash
    # Via npm (recommmended)
    REMOTE_USER=myuser REMOTE_HOST=1.2.3.4 npm run deploy

    # Directly
    ./deployment/deploy.sh --dry-run
    ```

## Customization

- **Domain Name**: Replace `hutusi.com` in `server_nginx.conf`.
- **Paths**: Default root is `/var/www/hutusi`.
