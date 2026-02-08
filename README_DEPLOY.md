# Deployment Guide

This guide explains how to deploy the static site to a remote Linux server using Nginx.

## Prerequisites

1.  **Local Machine:**
    *   Node.js installed.
    *   SSH access to the remote server.

2.  **Remote Server:**
    *   Nginx installed (`sudo apt install nginx`).
    *   Certbot installed (for SSL) (`sudo apt install certbot python3-certbot-nginx`).

## Deployment Steps

1.  **Edit Configuration:**
    *   Open `server_nginx.conf` and update `server_name` to your domain.
    *   Update the SSL paths if you are not using standard Let's Encrypt paths.

2.  **Run Deployment Script:**
    Run the `deploy.sh` script. You can pass your server details as environment variables.

    ```bash
    chmod +x deploy.sh
    REMOTE_USER=your_username REMOTE_HOST=your.server.ip ./deploy.sh
    ```

3.  **First Time SSL Setup:**
    If this is the first time setting up the server, the Nginx reload might fail if certificates are missing.
    SSH into your server and run:

    ```bash
    sudo certbot --nginx -d hutusi.com -d www.hutusi.com
    ```
    This will generate the certificates and potentially update your nginx config automatically.

## Directory Structure on Server

*   **Content:** `/var/www/hutusi`
*   **Config:** `/etc/nginx/sites-available/hutusi.com`
