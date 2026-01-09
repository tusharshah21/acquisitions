# Docker Setup Documentation

This document explains how to run the Acquisitions application using Docker for both development and production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Overview](#environment-overview)
- [Development Setup (Neon Local)](#development-setup-neon-local)
- [Production Setup (Neon Cloud)](#production-setup-neon-cloud)
- [Database Migrations](#database-migrations)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- A [Neon](https://neon.tech) account with a project created
- Neon API key (for development with Neon Local)

---

## Environment Overview

| Environment | Database                        | Docker Compose File       | Env File           |
| ----------- | ------------------------------- | ------------------------- | ------------------ |
| Development | Neon Local (ephemeral branches) | `docker-compose.dev.yml`  | `.env.development` |
| Production  | Neon Cloud                      | `docker-compose.prod.yml` | `.env.production`  |

### How DATABASE_URL Switches Between Environments

- **Development**: `postgres://neon:npg@neon-local:5432/neondb`
  - Connects to Neon Local proxy running in Docker
  - Creates ephemeral database branches automatically
  - Branches are deleted when container stops

- **Production**: `postgres://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
  - Connects directly to Neon Cloud
  - No local proxy needed
  - SSL required

---

## Development Setup (Neon Local)

Neon Local creates a local proxy that connects to your Neon Cloud project and automatically manages ephemeral branches for development and testing.

### Step 1: Get Neon Credentials

1. Go to [Neon Console](https://console.neon.tech)
2. Get your **API Key**: Settings → API Keys → Create new key
3. Get your **Project ID**: Select your project → Settings → General → Project ID
4. (Optional) Get **Parent Branch ID**: Branches → Select branch → Copy ID

### Step 2: Configure Environment

Copy and edit the development environment file:

```bash
# The .env.development file is already created
# Edit it with your Neon credentials:
```

Update `.env.development`:

```env
NEON_API_KEY=your_actual_neon_api_key
NEON_PROJECT_ID=your_actual_project_id
PARENT_BRANCH_ID=your_parent_branch_id  # Optional
```

### Step 3: Start Development Environment

```bash
# Start the application with Neon Local
docker compose -f docker-compose.dev.yml up

# Or run in detached mode
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f app
```

### Step 4: Access the Application

- **App**: http://localhost:3000
- **Neon Local Proxy**: localhost:5432

### Step 5: Stop Development Environment

```bash
# Stop and remove containers (ephemeral branch will be deleted)
docker compose -f docker-compose.dev.yml down

# Stop but keep volumes
docker compose -f docker-compose.dev.yml stop
```

### Persisting Branches per Git Branch

To keep database branches aligned with your git branches, the docker-compose.dev.yml is configured to:

1. Mount `./.neon_local/` for branch metadata
2. Mount `./.git/HEAD` to detect current git branch
3. Set `DELETE_BRANCH=false` if you want to persist branches

Add `.neon_local/` to your `.gitignore`:

```bash
echo ".neon_local/" >> .gitignore
```

---

## Production Setup (Neon Cloud)

Production connects directly to Neon Cloud without any local proxy.

### Step 1: Configure Environment

Update `.env.production` with your production credentials:

```env
# Get connection string from Neon Console → Connection Details
DATABASE_URL=postgres://your_user:your_password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)
```

### Step 2: Build Production Image

```bash
# Build the production image
docker compose -f docker-compose.prod.yml build
```

### Step 3: Run Migrations (One-time)

```bash
# Run database migrations
docker compose -f docker-compose.prod.yml --profile migrate up migrate
```

### Step 4: Start Production Environment

```bash
# Start the application
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f app

# Check health
docker compose -f docker-compose.prod.yml ps
```

### Step 5: Stop Production Environment

```bash
docker compose -f docker-compose.prod.yml down
```

---

## Database Migrations

### Development

```bash
# Run migrations in development
docker compose -f docker-compose.dev.yml --profile migrate up migrate

# Or exec into running container
docker compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production

```bash
# Run migrations in production (one-off)
docker compose -f docker-compose.prod.yml --profile migrate up migrate
```

### Generate New Migrations

```bash
# Generate migrations locally (outside Docker)
npm run db:generate

# Or inside container
docker compose -f docker-compose.dev.yml exec app npm run db:generate
```

---

## Environment Variables

### Development Variables (`.env.development`)

| Variable           | Required | Description                                     |
| ------------------ | -------- | ----------------------------------------------- |
| `NEON_API_KEY`     | Yes      | Your Neon API key                               |
| `NEON_PROJECT_ID`  | Yes      | Your Neon project ID                            |
| `PARENT_BRANCH_ID` | No       | Parent branch for ephemeral branches            |
| `DELETE_BRANCH`    | No       | Delete branch on container stop (default: true) |
| `JWT_SECRET`       | No       | JWT signing secret (has default for dev)        |
| `LOG_LEVEL`        | No       | Logging level (default: debug)                  |

### Production Variables (`.env.production`)

| Variable       | Required | Description                              |
| -------------- | -------- | ---------------------------------------- |
| `DATABASE_URL` | Yes      | Neon Cloud connection string             |
| `JWT_SECRET`   | Yes      | Strong JWT signing secret (min 32 chars) |
| `PORT`         | No       | Server port (default: 3000)              |
| `LOG_LEVEL`    | No       | Logging level (default: info)            |
| `CORS_ORIGINS` | No       | Allowed CORS origins                     |

---

## Useful Commands

### Development

```bash
# Start everything
docker compose -f docker-compose.dev.yml up

# Rebuild after package.json changes
docker compose -f docker-compose.dev.yml up --build

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f neon-local

# Access container shell
docker compose -f docker-compose.dev.yml exec app sh

# Clean up everything
docker compose -f docker-compose.dev.yml down -v --rmi local
```

### Production

```bash
# Deploy with latest changes
docker compose -f docker-compose.prod.yml up -d --build

# Rolling restart
docker compose -f docker-compose.prod.yml up -d --no-deps app

# View resource usage
docker stats acquisitions-app-prod

# Clean up old images
docker image prune -f
```

---

## Troubleshooting

### Neon Local Connection Issues

**Error**: `Connection refused to neon-local:5432`

**Solution**: Ensure Neon Local is healthy before starting the app:

```bash
docker compose -f docker-compose.dev.yml logs neon-local
```

### Invalid API Key

**Error**: `Invalid API key` in Neon Local logs

**Solution**: Verify your `NEON_API_KEY` in `.env.development` is correct and hasn't expired.

### Database URL Not Working

**Error**: App can't connect to database

**Solution**: Check the `DATABASE_URL` format:

- Development: `postgres://neon:npg@neon-local:5432/neondb`
- Production: `postgres://user:pass@ep-xxx.neon.tech/db?sslmode=require`

### Permission Denied Errors

**Error**: `EACCES: permission denied`

**Solution**: The production container runs as non-root user. Ensure mounted volumes have correct permissions.

### Hot Reload Not Working (Development)

**Solution**: Ensure volumes are mounted correctly:

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up --build
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT ENVIRONMENT                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐ │
│  │             │        │             │        │             │ │
│  │  Your App   │───────▶│ Neon Local  │───────▶│ Neon Cloud  │ │
│  │  (Docker)   │        │   Proxy     │        │ (Ephemeral  │ │
│  │             │        │  (Docker)   │        │   Branch)   │ │
│  └─────────────┘        └─────────────┘        └─────────────┘ │
│   localhost:3000         localhost:5432                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ENVIRONMENT                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐                              ┌─────────────┐   │
│  │             │                              │             │   │
│  │  Your App   │─────────────────────────────▶│ Neon Cloud  │   │
│  │  (Docker)   │         Direct SSL           │  Database   │   │
│  │             │         Connection           │             │   │
│  └─────────────┘                              └─────────────┘   │
│   your-domain:443                              *.neon.tech       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Notes

1. **Never commit `.env.production`** with real credentials to version control
2. Use Docker secrets or a secrets manager for production deployments
3. Rotate API keys and JWT secrets periodically
4. Keep Docker images updated for security patches
5. Use HTTPS in production with a reverse proxy (nginx, traefik, etc.)
