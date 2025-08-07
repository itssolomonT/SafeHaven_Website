# SafeHaven Security Systems - Architecture Documentation

## Overview

This document outlines the technical architecture and design decisions for the SafeHaven Security Systems multi-brand web application. The solution is designed to scale across 30+ brands while maintaining fast, mobile-first performance and comprehensive lead tracking.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • React 18      │    │ • REST API      │    │ • Relational    │
│ • TypeScript    │    │ • TypeScript    │    │ • ACID Compliant│
│ • Mobile-First  │    │ • Rate Limiting │    │ • Indexed       │
│ • SSR/SSG       │    │ • Caching       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │     Redis       │    │   File Storage  │
│                 │    │                 │    │                 │
│ • Images        │    │ • Sessions      │    │ • Logos         │
│ • CSS/JS        │    │ • Cache         │    │ • Assets        │
│ • Optimization  │    │ • Rate Limiting │    │ • Documents     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Next.js 14**: Server-side rendering, static generation, and API routes
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Data fetching, caching, and state management
- **Lucide React**: Icon library

#### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Prisma**: Database ORM
- **Redis**: Session storage and caching
- **PostgreSQL**: Primary database
- **Helmet**: Security middleware
- **Rate Limiting**: API protection

#### External APIs
- **Google Maps API**: Geocoding and location services
- **Weather API**: Local weather data
- **Geolocation API**: Browser-based location detection

## Multi-Brand Architecture

### Brand Configuration System

The application supports dynamic brand configuration through a centralized system:

```typescript
interface Brand {
  id: string;
  name: string;
  displayName: string;
  states: string[];
  zipCodes: string[];
  phoneNumber: string;
  website: string;
  colors: BrandColors;
  logo: string;
  ctaText: string;
  ctaColor: string;
  description: string;
  features: string[];
  testimonials: Testimonial[];
}
```

### ZIP Code Routing

The system implements intelligent ZIP code routing:

1. **Automatic Detection**: Uses browser geolocation to detect user's location
2. **Manual Input**: Users can enter their ZIP code manually
3. **Validation**: Validates ZIP codes against service areas
4. **Brand Assignment**: Routes users to the appropriate brand based on ZIP code
5. **Fallback**: Graceful handling when no brand is found for a ZIP code

### Brand-Specific Features

- **Dynamic Styling**: Each brand has its own color scheme and styling
- **Custom Content**: Brand-specific descriptions, features, and testimonials
- **Local Phone Numbers**: Each brand has its own contact information
- **Regional CTAs**: Custom call-to-action text for each brand

## Lead Tracking & Attribution

### Session Management

```typescript
interface Session {
  id: string;
  brandId: string;
  zipCode: string;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  utmParams?: UTMParams;
  isReturnVisitor: boolean;
  createdAt: Date;
  lastActivity: Date;
}
```

### Lead Attribution

- **UTM Parameters**: Track marketing campaign sources
- **Referrer Tracking**: Monitor traffic sources
- **Return Visitor Detection**: Identify repeat visitors
- **Session Persistence**: Maintain user context across visits

### Lead Management

```typescript
interface Lead {
  id: string;
  brandId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  address?: string;
  source: LeadSource;
  utmParams?: UTMParams;
  sessionId: string;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Design

### Core Tables

#### Brands
- Stores brand configuration and service areas
- Supports soft deletes for brand management
- JSON fields for flexible configuration

#### Sessions
- Tracks user sessions and interactions
- Links to brands and leads
- Supports analytics and attribution

#### Leads
- Stores lead information and status
- Links to sessions and brands
- Supports lead lifecycle management

#### Service Areas
- Maps brands to ZIP codes and states
- Supports geographic expansion
- Enables dynamic routing

#### Weather Cache
- Caches weather data to reduce API calls
- Includes expiration for data freshness
- Supports location-based weather display

## API Design

### RESTful Endpoints

#### Brands API
- `GET /api/brands` - List all active brands
- `GET /api/brands/:id` - Get brand by ID
- `GET /api/brands/zip/:zipCode` - Get brand by ZIP code
- `POST /api/brands` - Create new brand (admin)
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Deactivate brand

#### Leads API
- `POST /api/leads` - Create new lead
- `GET /api/leads/brand/:brandId` - Get leads by brand
- `GET /api/leads/:id` - Get lead by ID
- `PATCH /api/leads/:id/status` - Update lead status
- `GET /api/leads/analytics/:brandId` - Get lead analytics

#### Sessions API
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session by ID
- `PATCH /api/sessions/:id/activity` - Update session activity
- `GET /api/sessions/brand/:brandId` - Get sessions by brand
- `GET /api/sessions/analytics/:brandId` - Get session analytics

#### Weather API
- `GET /api/weather/:zipCode` - Get weather by ZIP code
- `DELETE /api/weather/cache/:zipCode` - Clear weather cache

#### Location API
- `GET /api/location/validate/:zipCode` - Validate ZIP code
- `GET /api/location/coordinates/:lat/:lng` - Get location by coordinates

## Performance & Scalability

### Frontend Optimization

- **Server-Side Rendering**: Fast initial page loads
- **Static Generation**: Pre-built pages for better performance
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for smaller bundles
- **Caching**: Aggressive caching strategies

### Backend Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Redis Caching**: Session and data caching
- **Rate Limiting**: API protection and abuse prevention
- **Compression**: Gzip compression for responses
- **Connection Pooling**: Efficient database connections

### Scalability Features

- **Horizontal Scaling**: Stateless design allows easy scaling
- **Load Balancing**: Ready for load balancer deployment
- **CDN Integration**: Static assets served via CDN
- **Database Sharding**: Prepared for database scaling
- **Microservices Ready**: Modular design for future microservices

## Security Features

### Frontend Security

- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Enforcement**: Secure communication
- **Input Validation**: Client-side validation
- **CSRF Protection**: Cross-site request forgery protection

### Backend Security

- **Helmet.js**: Security headers
- **Rate Limiting**: API abuse prevention
- **Input Sanitization**: Server-side validation
- **SQL Injection Prevention**: Prisma ORM protection
- **CORS Configuration**: Cross-origin resource sharing

### Data Security

- **Encryption**: Sensitive data encryption
- **Access Control**: Role-based access control
- **Audit Logging**: Comprehensive logging
- **Data Backup**: Regular backup procedures

## Deployment Architecture

### Development Environment

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
  
  backend:
    build: ./backend
    ports: ["4000:4000"]
    environment:
      - DATABASE_URL=postgresql://safehaven:safehaven123@postgres:5432/safehaven
      - REDIS_URL=redis://redis:6379
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=safehaven
      - POSTGRES_USER=safehaven
      - POSTGRES_PASSWORD=safehaven123
  
  redis:
    image: redis:7-alpine
```

### Production Deployment

- **Container Orchestration**: Kubernetes or Docker Swarm
- **Load Balancer**: Nginx or AWS ALB
- **Database**: Managed PostgreSQL service
- **Cache**: Managed Redis service
- **CDN**: CloudFront or similar
- **Monitoring**: Application performance monitoring
- **Logging**: Centralized logging system

## Monitoring & Analytics

### Application Monitoring

- **Health Checks**: `/health` endpoint for monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Uptime Monitoring**: Service availability tracking

### Business Analytics

- **Lead Conversion**: Track lead-to-customer conversion
- **Brand Performance**: Compare brand effectiveness
- **Geographic Analysis**: Service area performance
- **User Behavior**: Session and interaction analytics

## Future Enhancements

### Planned Features

1. **Admin Dashboard**: Brand management interface
2. **Advanced Analytics**: Business intelligence dashboard
3. **Mobile App**: Native mobile application
4. **Chat Integration**: Live chat support
5. **Payment Processing**: Online payment integration
6. **Multi-language Support**: International expansion
7. **AI/ML Integration**: Predictive analytics
8. **IoT Integration**: Smart home device integration

### Scalability Roadmap

1. **Microservices Migration**: Break down into smaller services
2. **Event-Driven Architecture**: Implement event sourcing
3. **GraphQL API**: More flexible data fetching
4. **Real-time Features**: WebSocket integration
5. **Edge Computing**: CDN-based processing

## Conclusion

The SafeHaven Security Systems architecture is designed for:

- **Scalability**: Easy expansion to 30+ brands
- **Performance**: Fast, mobile-first experience
- **Reliability**: Robust error handling and monitoring
- **Security**: Comprehensive security measures
- **Maintainability**: Clean, modular code structure
- **Flexibility**: Easy to extend and modify

This architecture provides a solid foundation for the multi-brand security company's digital presence while maintaining the flexibility to adapt to future business needs. 