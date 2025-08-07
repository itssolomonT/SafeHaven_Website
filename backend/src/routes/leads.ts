import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Lead, LeadSource, UTMParams } from '@safehaven/shared';

const prisma = new PrismaClient();

const router = express.Router();

// Enhanced lead creation with SafeHaven-specific tracking
router.post('/', async (req, res) => {
  try {
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
      previousVisits,
      // SafeHaven specific fields
      callSource, // 'inbound', 'outbound', 'door_knocking', 'online'
      salesTeam, // 'national_call_center', 'branch_level'
      leadPriority, // 'high', 'medium', 'low' based on SafeHaven criteria
      expectedCloseTime, // calculated based on 1.7 day average
      marketSegment, // ZIP code based market analysis
      brandSpecificData // brand-specific tracking data
    } = req.body;

    // Check for existing lead (return visitor personalization)
    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ],
        brandId
      }
    });

    // Enhanced lead data with SafeHaven tracking
    const leadData = {
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
      status: 'new',
      // SafeHaven specific tracking
      callSource: callSource || 'online',
      salesTeam: salesTeam || 'national_call_center',
      leadPriority: leadPriority || calculateSafeHavenPriority(source, utmParams, callSource),
      expectedCloseTime: expectedCloseTime || calculateSafeHavenCloseTime(source, callSource),
      marketSegment: marketSegment || await getMarketSegment(zipCode),
      brandSpecificData: brandSpecificData || {},
      // Enhanced scoring for SafeHaven
      leadScore: calculateSafeHavenLeadScore({
        source,
        deviceType,
        timeOnPage,
        scrollDepth,
        previousVisits,
        utmParams,
        callSource,
        existingLead: existingLead ? true : false
      }),
      // Return visitor personalization
      isReturnVisitor: existingLead ? true : false,
      previousInteractions: existingLead ? 1 : 0
    };

    const lead = await prisma.lead.create({
      data: leadData,
      include: {
        brand: true,
        session: true
      }
    });

    // Track lead creation event for SafeHaven analytics
    await prisma.leadEvent.create({
      data: {
        leadId: lead.id,
        eventType: 'lead_created',
        eventData: {
          source,
          conversionType,
          deviceType,
          utmParams,
          callSource,
          salesTeam,
          leadPriority: leadData.leadPriority,
          expectedCloseTime: leadData.expectedCloseTime,
          isReturnVisitor: leadData.isReturnVisitor
        }
      }
    });

    // If return visitor, create personalization event
    if (existingLead) {
      await prisma.leadEvent.create({
        data: {
          leadId: lead.id,
          eventType: 'return_visitor_personalization',
          eventData: {
            previousLeadId: existingLead.id,
            previousInteractions: 1,
                    personalizationData: {
          preferredContactMethod: existingLead.phone ? 'phone' : 'email',
          previousInterests: []
        }
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      data: lead,
              personalization: existingLead ? {
          isReturnVisitor: true,
          previousInteractions: 1,
          recommendedNextSteps: getRecommendedNextSteps(existingLead)
        } : null
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create lead'
    });
  }
});

// Get leads by brand
router.get('/brand/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const where: any = { brandId };
    if (status) {
      where.status = status;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        brand: true,
        session: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.lead.count({ where });

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

// Get lead by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        brand: true,
        session: true
      }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead'
    });
  }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: { status, notes },
      include: {
        brand: true,
        session: true
      }
    });

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update lead status'
    });
  }
});

// Enhanced lead analytics for multi-brand scaling
router.get('/analytics/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const where: any = { brandId };
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Comprehensive analytics for scaling across 30+ brands
    const [
      totalLeads,
      newLeads,
      convertedLeads,
      rejectedLeads,
      avgLeadScore,
      avgTimeToClose,
      conversionBySource,
      conversionByDevice,
      conversionByZipCode,
      dailyTrends,
      salesCycleMetrics
    ] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: 'new' } }),
      prisma.lead.count({ where: { ...where, status: 'converted' } }),
      prisma.lead.count({ where: { ...where, status: 'rejected' } }),
      prisma.lead.aggregate({
        where,
        _avg: { leadScore: true }
      }),
      prisma.lead.aggregate({
        where: { ...where, status: 'converted' },
        _avg: { 
          timeToClose: true 
        }
      }),
      prisma.lead.groupBy({
        by: ['source'],
        where,
        _count: { id: true },
        _avg: { leadScore: true }
      }),
      prisma.lead.groupBy({
        by: ['deviceType'],
        where,
        _count: { id: true },
        _avg: { leadScore: true }
      }),
      prisma.lead.groupBy({
        by: ['zipCode'],
        where,
        _count: { id: true },
        _avg: { leadScore: true }
      }),
      prisma.lead.groupBy({
        by: ['createdAt'],
        where,
        _count: { id: true }
      }),
      getSalesCycleMetrics(brandId, startDate as string, endDate as string)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalLeads,
          newLeads,
          convertedLeads,
          rejectedLeads,
          conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
          avgLeadScore: avgLeadScore._avg.leadScore || 0,
          avgTimeToClose: avgTimeToClose._avg.timeToClose || 0
        },
        breakdowns: {
          bySource: conversionBySource,
          byDevice: conversionByDevice,
          byZipCode: conversionByZipCode
        },
        trends: {
          daily: dailyTrends
        },
        salesCycle: salesCycleMetrics
      }
    });
  } catch (error) {
    console.error('Error fetching lead analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lead analytics'
    });
  }
});

// Get lead performance by ZIP code (for geographic scaling)
router.get('/performance/zip/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    const { brandId } = req.query;

    const where: any = { zipCode };
    if (brandId) {
      where.brandId = brandId;
    }

    const performance = await prisma.lead.groupBy({
      by: ['brandId', 'status'],
      where,
      _count: { id: true },
      _avg: { leadScore: true, timeToClose: true }
    });

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Error fetching ZIP performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ZIP performance'
    });
  }
});

// Track lead events for detailed attribution
router.post('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { eventType, eventData } = req.body;

    const event = await prisma.leadEvent.create({
      data: {
        leadId: id,
        eventType,
        eventData
      }
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating lead event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create lead event'
    });
  }
});

// Helper functions for lead scoring and prioritization
function calculateLeadScore(data: {
  source: string;
  deviceType: string;
  timeOnPage: number;
  scrollDepth: number;
  previousVisits: number;
  utmParams: any;
}): number {
  let score = 0;
  
  // Source scoring
  const sourceScores = {
    'organic_search': 10,
    'paid_search': 15,
    'social_media': 12,
    'direct': 8,
    'referral': 14,
    'email': 16
  };
  score += sourceScores[data.source as keyof typeof sourceScores] || 5;

  // Device scoring
  if (data.deviceType === 'mobile') score += 5; // Mobile users more likely to convert
  if (data.deviceType === 'desktop') score += 3;

  // Engagement scoring
  if (data.timeOnPage > 300) score += 10; // 5+ minutes
  if (data.scrollDepth > 75) score += 8; // Deep scroll
  if (data.previousVisits > 0) score += 15; // Return visitor

  // UTM parameter scoring
  if (data.utmParams?.campaign?.includes('high-intent')) score += 20;
  if (data.utmParams?.term?.includes('quote')) score += 15;

  return Math.min(score, 100); // Cap at 100
}

function calculateExpectedCloseTime(source: string, utmParams: any): number {
  const baseTime = 1.7 * 24 * 60 * 60 * 1000; // 1.7 days in milliseconds
  
  // Adjust based on source
  const sourceMultipliers = {
    'paid_search': 0.8, // Faster close
    'organic_search': 1.0,
    'social_media': 1.2, // Slower close
    'direct': 0.9,
    'referral': 0.7, // Fastest close
    'email': 0.6
  };

  const multiplier = sourceMultipliers[source as keyof typeof sourceMultipliers] || 1.0;
  
  // Adjust based on UTM parameters
  if (utmParams?.campaign?.includes('urgent')) return baseTime * 0.5;
  if (utmParams?.term?.includes('quote')) return baseTime * 0.8;

  return baseTime * multiplier;
}

function calculatePriority(source: string, utmParams: any): 'high' | 'medium' | 'low' {
  if (source === 'paid_search' || source === 'referral') return 'high';
  if (utmParams?.campaign?.includes('high-intent')) return 'high';
  if (source === 'organic_search') return 'medium';
  return 'low';
}

async function getSalesCycleMetrics(brandId: string, startDate: string, endDate: string) {
  const where: any = { brandId };
  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const [avgTimeToClose, avgTimeToRejection, conversionByDay] = await Promise.all([
    prisma.lead.aggregate({
      where: { ...where, status: 'converted' },
      _avg: { timeToClose: true }
    }),
    prisma.lead.aggregate({
      where: { ...where, status: 'rejected' },
      _avg: { timeToRejection: true }
    }),
    prisma.lead.groupBy({
      by: ['createdAt'],
      where: { ...where, status: 'converted' },
      _count: { id: true }
    })
  ]);

  return {
    avgTimeToClose: avgTimeToClose._avg.timeToClose || 0,
    avgTimeToRejection: avgTimeToRejection._avg.timeToRejection || 0,
    conversionByDay
  };
}

// SafeHaven-specific helper functions
function calculateSafeHavenPriority(source: string, utmParams: any, callSource?: string): 'high' | 'medium' | 'low' {
  // High priority for inbound calls and high-intent sources
  if (callSource === 'inbound') return 'high';
  if (source === 'paid_search' && utmParams?.term?.includes('quote')) return 'high';
  if (source === 'organic_search' && utmParams?.term?.includes('security')) return 'high';
  
  // Medium priority for return visitors and social media
  if (source === 'social_media') return 'medium';
  if (source === 'referral') return 'medium';
  
  return 'low';
}

function calculateSafeHavenCloseTime(source: string, callSource?: string): Date {
  // SafeHaven average sales cycle: 1.7 days
  const baseTime = 1.7 * 24 * 60 * 60 * 1000; // 1.7 days in milliseconds
  
  let multiplier = 1;
  
  // Inbound calls close faster
  if (callSource === 'inbound') multiplier = 0.8;
  // Door knocking takes longer
  if (callSource === 'door_knocking') multiplier = 1.5;
  // Online leads take standard time
  if (callSource === 'online') multiplier = 1.2;
  
  return new Date(Date.now() + (baseTime * multiplier));
}

async function getMarketSegment(zipCode: string): Promise<string> {
  // Simple market segmentation based on ZIP code
  const zipPrefix = zipCode.substring(0, 3);
  
  // High-value markets (example ZIP ranges)
  if (['100', '101', '102', '200', '201', '202'].includes(zipPrefix)) {
    return 'premium_urban';
  }
  
  // Suburban markets
  if (['300', '301', '400', '401', '500', '501'].includes(zipPrefix)) {
    return 'suburban_family';
  }
  
  // Rural markets
  if (['600', '601', '700', '701', '800', '801'].includes(zipPrefix)) {
    return 'rural_community';
  }
  
  return 'standard_market';
}

function calculateSafeHavenLeadScore(data: {
  source: string;
  deviceType: string;
  timeOnPage: number;
  scrollDepth: number;
  previousVisits: number;
  utmParams: any;
  callSource?: string;
  existingLead?: boolean;
}): number {
  let score = 0;
  
  // Base scoring from existing function
  const sourceScores = {
    'organic_search': 10,
    'paid_search': 15,
    'social_media': 12,
    'direct': 8,
    'referral': 14,
    'email': 16
  };
  score += sourceScores[data.source as keyof typeof sourceScores] || 5;

  // SafeHaven-specific scoring
  if (data.callSource === 'inbound') score += 25; // Inbound calls are highest value
  if (data.callSource === 'door_knocking') score += 20; // Door knocking is high value
  if (data.existingLead) score += 15; // Return visitors
  
  // Device scoring (mobile-first)
  if (data.deviceType === 'mobile') score += 8; // Mobile users more likely to convert
  if (data.deviceType === 'desktop') score += 5;

  // Engagement scoring
  if (data.timeOnPage > 300) score += 10; // 5+ minutes
  if (data.scrollDepth > 75) score += 8; // Deep scroll
  if (data.previousVisits > 0) score += 15; // Return visitor

  // UTM parameter scoring
  if (data.utmParams?.campaign?.includes('high-intent')) score += 20;
  if (data.utmParams?.term?.includes('quote')) score += 15;
  if (data.utmParams?.term?.includes('security')) score += 12;

  return Math.min(score, 100); // Cap at 100
}

function getRecommendedNextSteps(existingLead: any): string[] {
  const recommendations = [];
  
  // Default recommendations for return visitors
  recommendations.push('Get a free security quote');
  recommendations.push('View our pricing plans');
  recommendations.push('Speak with a security expert');
  
  return recommendations;
}

export default router; 