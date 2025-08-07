import express from 'express';
import { prisma } from '../index';
import { Session, UTMParams } from '@safehaven/shared';

const router = express.Router();

// Create new session with enhanced tracking
router.post('/', async (req, res) => {
  try {
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

    // Check if this is a return visitor
    const existingSession = await prisma.session.findFirst({
      where: {
        ipAddress,
        brandId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const isReturnVisitor = !!existingSession;

    const session = await prisma.session.create({
      data: {
        brandId,
        zipCode,
        userAgent,
        ipAddress,
        referrer,
        utmParams,
        isReturnVisitor,
        deviceType,
        screenResolution,
        language,
        timezone
      },
      include: {
        brand: true
      }
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session'
    });
  }
});

// Get session by ID with personalization data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        brand: true,
        leads: {
          include: {
            events: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Get personalization data for return visitors
    const personalizationData = session.isReturnVisitor ? 
      await getPersonalizationData(session) : null;

    res.json({
      success: true,
      data: {
        session,
        personalization: personalizationData
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session'
    });
  }
});

// Update session activity for tracking engagement
router.patch('/:id/activity', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      pageUrl, 
      timeOnPage, 
      scrollDepth, 
      interactions,
      conversionIntent 
    } = req.body;

    const session = await prisma.session.update({
      where: { id },
      data: {
        lastActivity: new Date(),
        pageUrl,
        timeOnPage,
        scrollDepth,
        interactions,
        conversionIntent
      }
    });

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error updating session activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update session activity'
    });
  }
});

// Get sessions by brand with analytics
router.get('/brand/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const where: any = { brandId };
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        brand: true,
        leads: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.session.count({ where });

    res.json({
      success: true,
      data: sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions'
    });
  }
});

// Get session analytics for multi-brand scaling
router.get('/analytics/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = { brandId };
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const [
      totalSessions,
      returnVisitors,
      newVisitors,
      avgTimeOnSite,
      conversionRate,
      deviceBreakdown,
      sourceBreakdown,
      zipCodeBreakdown,
      engagementMetrics
    ] = await Promise.all([
      prisma.session.count({ where }),
      prisma.session.count({ where: { ...where, isReturnVisitor: true } }),
      prisma.session.count({ where: { ...where, isReturnVisitor: false } }),
      prisma.session.aggregate({
        where,
        _avg: { timeOnPage: true }
      }),
      calculateConversionRate(brandId, startDate as string, endDate as string),
      prisma.session.groupBy({
        by: ['deviceType'],
        where,
        _count: { id: true }
      }),
      prisma.session.groupBy({
        by: ['referrer'],
        where,
        _count: { id: true }
      }),
      prisma.session.groupBy({
        by: ['zipCode'],
        where,
        _count: { id: true }
      }),
      getEngagementMetrics(brandId, startDate as string, endDate as string)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSessions,
          returnVisitors,
          newVisitors,
          returnVisitorRate: totalSessions > 0 ? (returnVisitors / totalSessions) * 100 : 0,
          avgTimeOnSite: avgTimeOnSite._avg.timeOnPage || 0,
          conversionRate
        },
        breakdowns: {
          byDevice: deviceBreakdown,
          bySource: sourceBreakdown,
          byZipCode: zipCodeBreakdown
        },
        engagement: engagementMetrics
      }
    });
  } catch (error) {
    console.error('Error fetching session analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session analytics'
    });
  }
});

// Get personalization recommendations for return visitors
router.get('/:id/personalization', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        brand: true,
        leads: true
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    const personalization = await getPersonalizationData(session);

    res.json({
      success: true,
      data: personalization
    });
  } catch (error) {
    console.error('Error fetching personalization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch personalization'
    });
  }
});

// Helper functions
async function getPersonalizationData(session: any) {
  // Get user's previous interactions
  const previousLeads = await prisma.lead.findMany({
    where: {
      session: {
        ipAddress: session.ipAddress,
        brandId: session.brandId
      }
    },
    include: {
      events: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Get popular content for this brand
  const popularContent = await getPopularContent(session.brandId);

  // Get personalized recommendations
  const recommendations = generateRecommendations(previousLeads, session);

  return {
    previousInteractions: previousLeads,
    popularContent,
    recommendations,
    isReturnVisitor: session.isReturnVisitor,
    lastVisit: previousLeads[0]?.createdAt || null
  };
}

async function getPopularContent(brandId: string) {
  // This would typically come from analytics data
  // For now, return default content
  return {
    popularPages: ['/quote', '/contact', '/features'],
    trendingFeatures: ['Smart Home Integration', 'Mobile App Control'],
    recommendedCTAs: ['Get Free Quote', 'Schedule Consultation']
  };
}

function generateRecommendations(previousLeads: any[], session: any) {
  const recommendations = {
    ctaText: 'Get Your Free Security Quote',
    priorityFeatures: [],
    personalizedMessage: ''
  };

  if (previousLeads.length > 0) {
    const lastLead = previousLeads[0];
    
    if (lastLead.status === 'converted') {
      recommendations.ctaText = 'Upgrade Your Security System';
      recommendations.personalizedMessage = 'Welcome back! Ready to enhance your security?';
    } else if (lastLead.status === 'rejected') {
      recommendations.ctaText = 'Special Offer - Limited Time';
      recommendations.personalizedMessage = 'We have a special offer just for you!';
    }
  }

  return recommendations;
}

async function calculateConversionRate(brandId: string, startDate: string, endDate: string) {
  const where: any = { brandId };
  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const [totalSessions, convertedLeads] = await Promise.all([
    prisma.session.count({ where }),
    prisma.lead.count({
      where: {
        ...where,
        status: 'converted'
      }
    })
  ]);

  return totalSessions > 0 ? (convertedLeads / totalSessions) * 100 : 0;
}

async function getEngagementMetrics(brandId: string, startDate: string, endDate: string) {
  const where: any = { brandId };
  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const [avgTimeOnPage, avgScrollDepth, highEngagementSessions] = await Promise.all([
    prisma.session.aggregate({
      where,
      _avg: { timeOnPage: true }
    }),
    prisma.session.aggregate({
      where,
      _avg: { scrollDepth: true }
    }),
    prisma.session.count({
      where: {
        ...where,
        timeOnPage: { gte: 300 }, // 5+ minutes
        scrollDepth: { gte: 75 }  // 75%+ scroll
      }
    })
  ]);

  return {
    avgTimeOnPage: avgTimeOnPage._avg.timeOnPage || 0,
    avgScrollDepth: avgScrollDepth._avg.scrollDepth || 0,
    highEngagementSessions
  };
}

export default router; 