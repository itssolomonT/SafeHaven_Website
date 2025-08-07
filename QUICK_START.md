# SafeHaven Security Systems - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get the SafeHaven Security Systems application running on your local machine quickly.

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 18+** (for development)
- **Git** for cloning the repository

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd safehaven-security-systems

# Install dependencies
npm install
```

## Step 2: Environment Configuration

```bash
# Copy environment file
cp env.example .env

# Edit .env file with your API keys
# You'll need Google Maps API and Weather API keys
```

## Step 3: Start Services

```bash
# Start all services (PostgreSQL, Redis)
docker-compose up -d

# Wait for services to be ready (about 30 seconds)
```

## Step 4: Database Setup

```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Go back to root
cd ..
```

## Step 5: Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# npm run dev:frontend
# npm run dev:backend
```

## 🎉 You're Ready!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## Test the Application

### Try Different ZIP Codes

Enter these ZIP codes to see different brands:

- **27000** → SafeHaven NC (North Carolina)
- **29000** → SafeHaven SC (South Carolina)
- **37000** → SafeHaven TN (Tennessee)
- **30000** → TopSecurity (Georgia)
- **32000** → BestSecurity (Florida)
- **35000** → RedHawk Alarms (Alabama)

### Features to Test

1. **Automatic Location Detection**: Allow location access when prompted
2. **Weather Display**: See local weather for your ZIP code
3. **Brand-Specific Styling**: Notice different colors and content per brand
4. **Phone Integration**: Click phone numbers to test calling
5. **Responsive Design**: Try on mobile or resize browser window

## Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart services
docker-compose restart
```

**Port Already in Use**
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :4000

# Kill processes if needed
kill -9 <PID>
```

**API Keys Missing**
```bash
# Get free API keys:
# Google Maps: https://developers.google.com/maps
# Weather API: https://openweathermap.org/api
```

### Development Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

## Next Steps

1. **Read the Documentation**: Check `/docs` folder for detailed guides
2. **Explore the Code**: Review the architecture and implementation
3. **Customize**: Modify brands, styling, or add features
4. **Deploy**: Follow the deployment guide for production setup

## Support

- **Architecture**: `docs/ARCHITECTURE.md`
- **Deployment**: `docs/DEPLOYMENT.md`
- **API Reference**: Available in the codebase
- **Presentation**: `docs/PRESENTATION.md`

---

**Happy Coding! 🎯**

The SafeHaven Security Systems application is now ready for development and testing. 