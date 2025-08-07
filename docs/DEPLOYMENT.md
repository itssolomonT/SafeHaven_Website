# SafeHaven Security Systems - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the SafeHaven Security Systems application. The application is designed to be deployed using Docker containers and can be scaled horizontally.

## Prerequisites

### Required Software
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Node.js**: Version 18 or higher (for development)
- **Git**: For version control

### Required Services
- **PostgreSQL**: Database server
- **Redis**: Caching and session storage
- **Google Maps API**: For location services
- **Weather API**: For weather data (OpenWeatherMap recommended)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd safehaven-security-systems
```

### 2. Environment Variables

Create environment files for different environments:

#### Development (.env.development)
```bash
# Database
DATABASE_URL=postgresql://safehaven:safehaven123@localhost:5432/safehaven

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_weather_api_key

# Application
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_key
```

#### Production (.env.production)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/safehaven

# Redis
REDIS_URL=redis://host:6379

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_weather_api_key

# Application
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-domain.com

# Security
JWT_SECRET=your_secure_jwt_secret_key
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspaces
```

## Development Deployment

### 1. Start Services with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Database Setup

```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

### 4. Verify Installation

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **Database**: PostgreSQL on localhost:5432
- **Redis**: localhost:6379

## Production Deployment

### 1. Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.your-domain.com
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=safehaven
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

### 3. Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:4000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://backend;
        }
    }
}
```

### 4. SSL Certificate Setup

```bash
# Generate SSL certificate (Let's Encrypt)
sudo certbot certonly --nginx -d your-domain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
```

## Cloud Deployment

### AWS Deployment

#### 1. ECS/Fargate Setup

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name safehaven-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service --cluster safehaven-cluster --service-name safehaven-service --task-definition safehaven:1
```

#### 2. RDS Database Setup

```bash
# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier safehaven-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username safehaven \
    --master-user-password your-password \
    --allocated-storage 20
```

#### 3. ElastiCache Redis Setup

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
    --cache-cluster-id safehaven-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1
```

### Google Cloud Platform

#### 1. Cloud Run Deployment

```bash
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT_ID/safehaven

# Deploy to Cloud Run
gcloud run deploy safehaven \
    --image gcr.io/PROJECT_ID/safehaven \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

#### 2. Cloud SQL Setup

```bash
# Create PostgreSQL instance
gcloud sql instances create safehaven-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1
```

## Monitoring & Logging

### 1. Application Monitoring

```bash
# Install monitoring tools
npm install --save-dev @sentry/node @sentry/react

# Configure Sentry
SENTRY_DSN=your_sentry_dsn
```

### 2. Log Aggregation

```bash
# Use Docker logging driver
docker run --log-driver=fluentd --log-opt fluentd-address=localhost:24224 your-app
```

### 3. Health Checks

```bash
# Monitor application health
curl -f http://localhost:4000/health || exit 1
```

## Backup & Recovery

### 1. Database Backup

```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Schedule with cron
0 2 * * * /path/to/backup-script.sh
```

### 2. File Backup

```bash
# Backup uploads and assets
tar -czf assets_backup_$(date +%Y%m%d).tar.gz ./uploads/
```

## Security Considerations

### 1. Environment Variables

```bash
# Use secrets management
docker secret create db_password ./db_password.txt
docker secret create jwt_secret ./jwt_secret.txt
```

### 2. Network Security

```bash
# Configure firewall rules
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 3. SSL/TLS Configuration

```bash
# Generate strong SSL configuration
openssl dhparam -out dhparam.pem 2048
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connectivity
docker exec -it safehaven-postgres psql -U safehaven -d safehaven

# Verify connection string
echo $DATABASE_URL
```

#### 2. Redis Connection Issues

```bash
# Test Redis connection
docker exec -it safehaven-redis redis-cli ping

# Check Redis logs
docker logs safehaven-redis
```

#### 3. Frontend Build Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_leads_brand_id ON leads(brand_id);
CREATE INDEX idx_sessions_brand_id ON sessions(brand_id);
CREATE INDEX idx_weather_cache_zip_code ON weather_cache(zip_code);
```

#### 2. Caching Strategy

```bash
# Configure Redis for optimal performance
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Scaling Considerations

### 1. Horizontal Scaling

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Use load balancer
docker run -d --name nginx-lb nginx:alpine
```

### 2. Database Scaling

```bash
# Set up read replicas
# Configure connection pooling
# Implement database sharding
```

### 3. CDN Integration

```bash
# Configure CloudFront distribution
# Set up S3 for static assets
# Implement edge caching
```

## Conclusion

This deployment guide provides a comprehensive approach to deploying the SafeHaven Security Systems application. The solution is designed to be:

- **Scalable**: Easy to scale horizontally and vertically
- **Secure**: Comprehensive security measures
- **Reliable**: Robust error handling and monitoring
- **Maintainable**: Clear deployment procedures
- **Flexible**: Adaptable to different hosting environments

For additional support or questions, refer to the architecture documentation or contact the development team. 