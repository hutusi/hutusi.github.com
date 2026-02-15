# hutusi.com Deployment Guide

This guide provides instructions for deploying the static site to a remote Linux server using Bun.

## Prerequisites

1.  **Local Machine**: `bun`, `rsync`, `ssh`.
    - If using a password instead of SSH keys, you must install `sshpass`.
2.  **Remote Server**: Nginx, Certbot.

## Deployment Command

You can run the deployment via `bun run deploy`. It accepts arguments for the host, user, and password.

### Examples

```bash
# Deploy using SSH keys (recommended)
bun run deploy -- --host 1.2.3.4 --user myuser

# Deploy using a password
bun run deploy -- --host 1.2.3.4 --user myuser --pass mysecretpassword

# Setup Nginx configuration (first time or when config changes)
bun run deploy -- --host 1.2.3.4 --user myuser --setup-nginx

# Dry run (preview changes)
bun run deploy -- --host 1.2.3.4 --user myuser --dry-run
```

### Environment Variables

Alternatively, you can set environment variables:

```bash
REMOTE_HOST=1.2.3.4 REMOTE_USER=myuser REMOTE_PASS=mypass bun run deploy
```

## Nginx configuration

The configuration is in `deployment/server_nginx.conf`. Update the `server_name` and SSL paths as needed before running with `--setup-nginx`.
