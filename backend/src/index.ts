import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      api: 'connected'
    }
  });
});

// Mock brands API - supports brand-specific styling and scaling
app.get('/api/brands', (req, res) => {
  const { page = 1, limit = 20, state, isActive, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
  
  const brands = [
    {
      id: 'safehaven-nc',
      name: 'SafeHaven NC',
      displayName: 'SafeHaven Security Systems',
      states: ['NC'],
      zipCodes: ['27000', '27001', '27002', '27003', '27004'],
      phoneNumber: '(919) 555-0123',
      website: 'https://safehaven-nc.com',
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#f59e0b'
      },
      logo: '/logos/safehaven-nc.svg',
      ctaText: 'Get Your Free Security Quote',
      ctaColor: '#1e40af',
      description: 'North Carolina\'s trusted home security provider.',
      features: [
        '24/7 Professional Monitoring',
        'Smart Home Integration',
        'Mobile App Control',
        'Video Surveillance',
        'Environmental Monitoring'
      ],
      testimonials: [
        {
          name: 'Sarah Johnson',
          location: 'Raleigh, NC',
          rating: 5,
          text: 'SafeHaven has been protecting our family for over 3 years. Excellent service!'
        },
        {
          name: 'Mike Chen',
          location: 'Charlotte, NC',
          rating: 5,
          text: 'Professional installation and great customer support. Highly recommend!'
        }
      ],
      isActive: true,
      _count: {
        leads: 45,
        sessions: 120
      }
    },
    {
      id: 'safehaven-sc',
      name: 'SafeHaven SC',
      displayName: 'SafeHaven Security Systems',
      states: ['SC'],
      zipCodes: ['29000', '29001', '29002', '29003', '29004'],
      phoneNumber: '(803) 555-0123',
      website: 'https://safehaven-sc.com',
      colors: {
        primary: '#059669',
        secondary: '#10b981',
        accent: '#f59e0b'
      },
      logo: '/logos/safehaven-sc.svg',
      ctaText: 'Protect Your South Carolina Home',
      ctaColor: '#059669',
      description: 'South Carolina\'s premier security provider.',
      features: [
        '24/7 Professional Monitoring',
        'Smart Home Integration',
        'Mobile App Control',
        'Video Surveillance',
        'Environmental Monitoring'
      ],
      testimonials: [
        {
          name: 'David Wilson',
          location: 'Columbia, SC',
          rating: 5,
          text: 'Outstanding security system. The mobile app is fantastic!'
        },
        {
          name: 'Lisa Rodriguez',
          location: 'Greenville, SC',
          rating: 5,
          text: 'Quick response times and reliable monitoring. Peace of mind!'
        }
      ],
      isActive: true,
      _count: {
        leads: 38,
        sessions: 95
      }
    },
    {
      id: 'topsecurity',
      name: 'Top Security',
      displayName: 'Top Security Systems',
      states: ['GA', 'FL'],
      zipCodes: ['30000', '30001', '30002', '32000', '32001'],
      phoneNumber: '(404) 555-0123',
      website: 'https://topsecurity.com',
      colors: {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f59e0b'
      },
      logo: '/logos/topsecurity.svg',
      ctaText: 'Secure Your Home Today',
      ctaColor: '#dc2626',
      description: 'Georgia and Florida\'s leading security provider.',
      features: [
        '24/7 Professional Monitoring',
        'Smart Home Integration',
        'Mobile App Control',
        'Video Surveillance',
        'Environmental Monitoring'
      ],
      testimonials: [
        {
          name: 'Robert Davis',
          location: 'Atlanta, GA',
          rating: 5,
          text: 'Top-notch security system with excellent customer service!'
        },
        {
          name: 'Maria Garcia',
          location: 'Miami, FL',
          rating: 5,
          text: 'Reliable monitoring and great value for the price.'
        }
      ],
      isActive: true,
      _count: {
        leads: 52,
        sessions: 140
      }
    }
  ];

  // Filter brands based on query parameters
  let filteredBrands = brands;
  
  if (state) {
    filteredBrands = filteredBrands.filter(brand => 
      brand.states.includes(state as string)
    );
  }
  
  if (isActive !== undefined) {
    filteredBrands = filteredBrands.filter(brand => 
      brand.isActive === (isActive === 'true')
    );
  }
  
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredBrands = filteredBrands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm) ||
      brand.displayName.toLowerCase().includes(searchTerm) ||
      brand.description.toLowerCase().includes(searchTerm)
    );
  }

  // Sort brands
  filteredBrands.sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedBrands = filteredBrands.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedBrands,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: filteredBrands.length,
      totalPages: Math.ceil(filteredBrands.length / Number(limit))
    }
  });
});

// Get brand by ZIP code for geographic scaling
app.get('/api/brands/zip/:zipCode', (req, res) => {
  const { zipCode } = req.params;
  
  const brands = [
    {
      id: 'safehaven-nc',
      name: 'SafeHaven NC',
      displayName: 'SafeHaven Security Systems',
      states: ['NC'],
      zipCodes: ['27000', '27001', '27002', '27003', '27004'],
      phoneNumber: '(919) 555-0123',
      website: 'https://safehaven-nc.com',
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#f59e0b'
      },
      logo: '/logos/safehaven-nc.svg',
      ctaText: 'Get Your Free Security Quote',
      ctaColor: '#1e40af',
      description: 'North Carolina\'s trusted home security provider.',
      features: [
        '24/7 Professional Monitoring',
        'Smart Home Integration',
        'Mobile App Control'
      ],
      isActive: true
    },
    {
      id: 'safehaven-sc',
      name: 'SafeHaven SC',
      displayName: 'SafeHaven Security Systems',
      states: ['SC'],
      zipCodes: ['29000', '29001', '29002', '29003', '29004'],
      phoneNumber: '(803) 555-0123',
      website: 'https://safehaven-sc.com',
      colors: {
        primary: '#059669',
        secondary: '#10b981',
        accent: '#f59e0b'
      },
      logo: '/logos/safehaven-sc.svg',
      ctaText: 'Protect Your South Carolina Home',
      ctaColor: '#059669',
      description: 'South Carolina\'s premier security provider.',
      features: [
        '24/7 Professional Monitoring',
        'Smart Home Integration',
        'Mobile App Control'
      ],
      isActive: true
    }
  ];

  const brand = brands.find(b => b.zipCodes.includes(zipCode));
  
  if (!brand) {
    return res.status(404).json({
      success: false,
      error: 'No brand found for this ZIP code'
    });
  }

  res.json({
    success: true,
    data: brand
  });
});

// Enhanced leads API with accurate tracking and sales cycle metrics
app.post('/api/leads', (req, res) => {
  const {
    brandId,
    firstName,
    lastName,
    email,
    phone,
    zipCode,
    address,
    source,
    utmParams,
    sessionId,
    conversionType, // 'phone_call', 'form_submit', 'chat', 'quote_request'
    deviceType, // 'mobile', 'desktop', 'tablet'
    pageUrl,
    timeOnPage,
    scrollDepth,
    previousVisits
  } = req.body;

  // Calculate lead score based on engagement and source
  let score = 0;
  
  // Source scoring
  const sourceScores: Record<string, number> = {
    'organic_search': 10,
    'paid_search': 15,
    'social_media': 12,
    'direct': 8,
    'referral': 14,
    'email': 16
  };
  score += sourceScores[source] || 5;

  // Device scoring
  if (deviceType === 'mobile') score += 5; // Mobile users more likely to convert
  if (deviceType === 'desktop') score += 3;

  // Engagement scoring
  if (timeOnPage > 300) score += 10; // 5+ minutes
  if (scrollDepth > 75) score += 8; // Deep scroll
  if (previousVisits > 0) score += 15; // Return visitor

  // UTM parameter scoring
  if (utmParams?.campaign?.includes('high-intent')) score += 20;
  if (utmParams?.term?.includes('quote')) score += 15;

  score = Math.min(score, 100); // Cap at 100

  // Calculate expected close time (1.7 days average)
  const baseTime = 1.7 * 24 * 60 * 60 * 1000; // 1.7 days in milliseconds
  const sourceMultipliers: Record<string, number> = {
    'paid_search': 0.8, // Faster close
    'organic_search': 1.0,
    'social_media': 1.2, // Slower close
    'direct': 0.9,
    'referral': 0.7, // Fastest close
    'email': 0.6
  };
  const multiplier = sourceMultipliers[source] || 1.0;
  const expectedCloseTime = new Date(Date.now() + (baseTime * multiplier));

  // Calculate priority
  let priority: 'high' | 'medium' | 'low' = 'low';
  if (source === 'paid_search' || source === 'referral') priority = 'high';
  if (utmParams?.campaign?.includes('high-intent')) priority = 'high';
  if (source === 'organic_search') priority = 'medium';

  const lead = {
    id: `lead_${Date.now()}`,
    brandId,
    firstName,
    lastName,
    email,
    phone,
    zipCode,
    address,
    source,
    utmParams,
    sessionId,
    conversionType,
    deviceType,
    pageUrl,
    timeOnPage,
    scrollDepth,
    previousVisits,
    leadScore: score,
    priority,
    expectedCloseTime,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: lead
  });
});

// Sessions API with personalization for return visitors
app.post('/api/sessions', (req, res) => {
  const {
    brandId,
    zipCode,
    userAgent,
    ipAddress,
    referrer,
    utmParams,
    deviceType,
    screenResolution,
    language,
    timezone
  } = req.body;

  // Check if return visitor (mock logic)
  const isReturnVisitor = Math.random() > 0.7; // 30% chance of return visitor

  const session = {
    id: `session_${Date.now()}`,
    brandId,
    zipCode,
    userAgent,
    ipAddress,
    referrer,
    utmParams,
    deviceType,
    screenResolution,
    language,
    timezone,
    isReturnVisitor,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: session
  });
});

// Update session activity for personalization
app.patch('/api/sessions/:id/activity', (req, res) => {
  const { id } = req.params;
  const {
    pageUrl,
    timeOnPage,
    scrollDepth,
    interactions,
    conversionIntent
  } = req.body;

  const session = {
    id,
    pageUrl,
    timeOnPage,
    scrollDepth,
    interactions,
    conversionIntent,
    lastActivity: new Date().toISOString()
  };

  res.json({
    success: true,
    data: session
  });
});

// Personalization API for return visitors
app.get('/api/sessions/:id/personalization', (req, res) => {
  const { id } = req.params;
  
  const personalization = {
    isReturnVisitor: true,
    previousInteractions: [
      {
        type: 'lead_submission',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'converted'
      }
    ],
    recommendations: {
      ctaText: 'Upgrade Your Security System',
      priorityFeatures: ['Smart Home Integration', 'Mobile App Control'],
      personalizedMessage: 'Welcome back! Ready to enhance your security?'
    },
    popularContent: {
      popularPages: ['/quote', '/contact', '/features'],
      trendingFeatures: ['Smart Home Integration', 'Mobile App Control']
    }
  };

  res.json({
    success: true,
    data: personalization
  });
});

// Enhanced lead analytics for multi-brand scaling
app.get('/api/leads/analytics/:brandId', (req, res) => {
  const { brandId } = req.params;
  const { startDate, endDate } = req.query;
  
  const analytics = {
    overview: {
      totalLeads: 150,
      newLeads: 120,
      convertedLeads: 45,
      rejectedLeads: 15,
      conversionRate: 30.0,
      avgLeadScore: 78,
      avgTimeToClose: 1.7,
      avgTimeToRejection: 9.6
    },
    breakdowns: {
      bySource: [
        { source: 'paid_search', count: 45, avgScore: 82 },
        { source: 'organic_search', count: 35, avgScore: 75 },
        { source: 'social_media', count: 25, avgScore: 68 },
        { source: 'direct', count: 20, avgScore: 72 },
        { source: 'referral', count: 15, avgScore: 85 },
        { source: 'email', count: 10, avgScore: 88 }
      ],
      byDevice: [
        { deviceType: 'mobile', count: 85, avgScore: 81 },
        { deviceType: 'desktop', count: 50, avgScore: 74 },
        { deviceType: 'tablet', count: 15, avgScore: 76 }
      ],
      byZipCode: [
        { zipCode: '27000', count: 25, avgScore: 79 },
        { zipCode: '27001', count: 20, avgScore: 76 },
        { zipCode: '27002', count: 18, avgScore: 82 }
      ]
    },
    trends: {
      daily: [
        { date: '2024-01-15', count: 12 },
        { date: '2024-01-16', count: 15 },
        { date: '2024-01-17', count: 18 }
      ]
    },
    salesCycle: {
      avgTimeToClose: 1.7,
      avgTimeToRejection: 9.6,
      conversionByDay: [
        { date: '2024-01-15', conversions: 4 },
        { date: '2024-01-16', conversions: 5 },
        { date: '2024-01-17', conversions: 6 }
      ]
    }
  };

  res.json({
    success: true,
    data: analytics
  });
});

// Weather API for improved user experience
app.get('/api/weather/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    // Check if we have a weather API key
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      // Fallback to mock data if no API key
      const weather = {
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        location: 'Raleigh'
      };
      
      return res.json({
        success: true,
        data: weather
      });
    }

    // Fetch real weather data from OpenWeatherMap
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const weatherData = await response.json() as any;
    
    const weather = {
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      location: weatherData.name
    };

    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    // Fallback to mock data on error
    const weather = {
      temperature: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      location: 'Raleigh'
    };
    
    res.json({
      success: true,
      data: weather
    });
  }
});

// Location API for ZIP code validation
app.get('/api/location/validate/:zipCode', (req, res) => {
  const { zipCode } = req.params;
  
  const location = {
    zipCode,
    city: 'Raleigh',
    state: 'NC',
    county: 'Wake',
    timezone: 'America/New_York',
    coordinates: {
      lat: 35.7796,
      lng: -78.6382
    }
  };

  res.json({
    success: true,
    data: location
  });
});

// SafeHaven Analytics API - Comprehensive dashboard for scaling
app.get('/api/analytics/dashboard', (req, res) => {
  const { brandId, startDate, endDate } = req.query;
  
  // Mock analytics data for SafeHaven requirements
  const analytics = {
    overview: {
      totalLeads: 1247,
      averageLeadScore: 78.5,
      averageSalesCycle: 1.7,
      conversionRate: 23.4
    },
    leadSources: [
      { source: 'inbound', count: 456, averageScore: 85.2 },
      { source: 'online', count: 342, averageScore: 72.1 },
      { source: 'door_knocking', count: 289, averageScore: 79.8 },
      { source: 'outbound', count: 160, averageScore: 68.3 }
    ],
    callSources: [
      { callSource: 'inbound', count: 456, averageScore: 85.2 },
      { callSource: 'online', count: 342, averageScore: 72.1 },
      { callSource: 'door_knocking', count: 289, averageScore: 79.8 },
      { callSource: 'outbound', count: 160, averageScore: 68.3 }
    ],
    salesCycle: {
      totalConverted: 292,
      avgTimeToClose: 1.7,
      targetTimeToClose: 1.7,
      performanceVsTarget: 'on_target'
    },
    geographic: [
      { zipCode: '27000', leadCount: 45, averageScore: 82.1, marketSegment: 'suburban_family' },
      { zipCode: '27001', leadCount: 38, averageScore: 79.3, marketSegment: 'suburban_family' },
      { zipCode: '27002', leadCount: 52, averageScore: 85.7, marketSegment: 'premium_urban' }
    ],
    brands: [
      { brandId: 'safehaven-nc', leadCount: 647, averageScore: 81.2, averageTimeToClose: 1.6 },
      { brandId: 'safehaven-sc', leadCount: 600, averageScore: 75.8, averageTimeToClose: 1.8 }
    ],
    conversions: {
      overall: 23.4,
      byTeam: {
        national_call_center: { total: 798, converted: 187 },
        branch_level: { total: 449, converted: 105 }
      }
    }
  };

  res.json({
    success: true,
    data: analytics
  });
});

// Geographic performance analytics
app.get('/api/analytics/geographic/:zipCode', (req, res) => {
  const { zipCode } = req.params;
  const { brandId } = req.query;
  
  const performance = {
    zipCode,
    marketSegment: getMarketSegment(zipCode),
    performance: [
      { brandId: 'safehaven-nc', status: 'converted', callSource: 'inbound', count: 12, avgScore: 85.2, avgTimeToClose: 1.4 },
      { brandId: 'safehaven-nc', status: 'new', callSource: 'online', count: 8, avgScore: 72.1, avgTimeToClose: null },
      { brandId: 'safehaven-sc', status: 'converted', callSource: 'door_knocking', count: 15, avgScore: 79.8, avgTimeToClose: 1.9 }
    ],
    totalLeads: 35,
    averageLeadScore: 79.0,
    averageTimeToClose: 1.65
  };

  res.json({
    success: true,
    data: performance
  });
});

// Sales team performance analytics
app.get('/api/analytics/sales-teams', (req, res) => {
  const analytics = {
    nationalCallCenter: {
      totalLeads: 798,
      averageLeadScore: 81.5,
      averageTimeToClose: 1.6,
      breakdown: [
        { callSource: 'inbound', count: 456, avgScore: 85.2, avgTimeToClose: 1.4 },
        { callSource: 'online', count: 342, avgScore: 72.1, avgTimeToClose: 1.8 }
      ]
    },
    branchLevel: {
      totalLeads: 449,
      averageLeadScore: 74.2,
      averageTimeToClose: 1.9,
      breakdown: [
        { callSource: 'door_knocking', count: 289, avgScore: 79.8, avgTimeToClose: 1.9 },
        { callSource: 'outbound', count: 160, avgScore: 68.3, avgTimeToClose: 2.1 }
      ]
    }
  };

  res.json({
    success: true,
    data: analytics
  });
});

// Brand scaling analytics
app.get('/api/analytics/brand-scaling', (req, res) => {
  const analytics = {
    totalBrands: 2,
    averageConversionRate: 23.4,
    averageTimeToClose: 1.7,
    brands: [
      {
        brandId: 'safehaven-nc',
        brandName: 'SafeHaven NC',
        totalLeads: 647,
        conversionRate: 24.1,
        averageTimeToClose: 1.6,
        averageLeadScore: 81.2,
        marketCoverage: 45
      },
      {
        brandId: 'safehaven-sc',
        brandName: 'SafeHaven SC',
        totalLeads: 600,
        conversionRate: 22.7,
        averageTimeToClose: 1.8,
        averageLeadScore: 75.8,
        marketCoverage: 38
      }
    ]
  };

  res.json({
    success: true,
    data: analytics
  });
});

// Helper function for market segmentation
function getMarketSegment(zipCode: string): string {
  const zipPrefix = zipCode.substring(0, 3);
  
  if (['100', '101', '102', '200', '201', '202'].includes(zipPrefix)) {
    return 'premium_urban';
  }
  
  if (['300', '301', '400', '401', '500', '501'].includes(zipPrefix)) {
    return 'suburban_family';
  }
  
  if (['600', '601', '700', '701', '800', '801'].includes(zipPrefix)) {
    return 'rural_community';
  }
  
  return 'standard_market';
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SafeHaven API server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend URL: http://localhost:3000`);
});

export default app; 