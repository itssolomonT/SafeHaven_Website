import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get SafeHaven-specific analytics dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const { brandId, startDate, endDate } = req.query;
    
    const where: any = {};
    if (brandId) where.brandId = brandId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Get comprehensive analytics
    const [
      totalLeads,
      leadsBySource,
      leadsByCallSource,
      salesCycleMetrics,
      geographicPerformance,
      brandPerformance,
      conversionRates
    ] = await Promise.all([
      // Total leads
      prisma.lead.count({ where }),
      
      // Leads by source (for attribution)
      prisma.lead.groupBy({
        by: ['source'],
        where,
        _count: { id: true },
        _avg: { leadScore: true }
      }),
      
      // Leads by call source (SafeHaven specific)
      prisma.lead.groupBy({
        by: ['callSource'],
        where,
        _count: { id: true },
        _avg: { leadScore: true }
      }),
      
      // Sales cycle metrics (1.7 day average)
      getSalesCycleMetrics(where),
      
      // Geographic performance (ZIP code scaling)
      getGeographicPerformance(where),
      
      // Brand performance comparison
      getBrandPerformance(where),
      
      // Conversion rates by team
      getConversionRates(where)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalLeads,
          averageLeadScore: leadsBySource.reduce((sum, item) => sum + (item._avg.leadScore || 0), 0) / leadsBySource.length,
          averageSalesCycle: salesCycleMetrics.avgTimeToClose,
          conversionRate: conversionRates.overall
        },
        leadSources: leadsBySource.map(item => ({
          source: item.source,
          count: item._count.id,
          averageScore: item._avg.leadScore
        })),
        callSources: leadsByCallSource.map(item => ({
          callSource: item.callSource,
          count: item._count.id,
          averageScore: item._avg.leadScore
        })),
        salesCycle: salesCycleMetrics,
        geographic: geographicPerformance,
        brands: brandPerformance,
        conversions: conversionRates
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Get lead performance by ZIP code (for geographic scaling)
router.get('/geographic/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    const { brandId, startDate, endDate } = req.query;

    const where: any = { zipCode };
    if (brandId) where.brandId = brandId;
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const performance = await prisma.lead.groupBy({
      by: ['brandId', 'status', 'callSource'],
      where,
      _count: { id: true },
      _avg: { leadScore: true, timeToClose: true }
    });

    // Calculate market segment
    const marketSegment = getMarketSegment(zipCode);

    res.json({
      success: true,
      data: {
        zipCode,
        marketSegment,
        performance,
        totalLeads: performance.reduce((sum, item) => sum + item._count.id, 0),
        averageLeadScore: performance.reduce((sum, item) => sum + (item._avg.leadScore || 0), 0) / performance.length,
        averageTimeToClose: performance.reduce((sum, item) => sum + (item._avg.timeToClose || 0), 0) / performance.length
      }
    });
  } catch (error) {
    console.error('Error fetching geographic performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch geographic performance'
    });
  }
});

// Get sales team performance (national call center vs branch level)
router.get('/sales-teams', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const teamPerformance = await prisma.lead.groupBy({
      by: ['salesTeam', 'callSource'],
      where,
      _count: { id: true },
      _avg: { leadScore: true, timeToClose: true }
    });

    // Calculate team-specific metrics
    const nationalCallCenter = teamPerformance.filter(item => item.salesTeam === 'national_call_center');
    const branchLevel = teamPerformance.filter(item => item.salesTeam === 'branch_level');

    res.json({
      success: true,
      data: {
        nationalCallCenter: {
          totalLeads: nationalCallCenter.reduce((sum, item) => sum + item._count.id, 0),
          averageLeadScore: nationalCallCenter.reduce((sum, item) => sum + (item._avg.leadScore || 0), 0) / nationalCallCenter.length,
          averageTimeToClose: nationalCallCenter.reduce((sum, item) => sum + (item._avg.timeToClose || 0), 0) / nationalCallCenter.length,
          breakdown: nationalCallCenter
        },
        branchLevel: {
          totalLeads: branchLevel.reduce((sum, item) => sum + item._count.id, 0),
          averageLeadScore: branchLevel.reduce((sum, item) => sum + (item._avg.leadScore || 0), 0) / branchLevel.length,
          averageTimeToClose: branchLevel.reduce((sum, item) => sum + (item._avg.timeToClose || 0), 0) / branchLevel.length,
          breakdown: branchLevel
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sales team performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales team performance'
    });
  }
});

// Get brand scaling metrics (for 5-10 new brands per year)
router.get('/brand-scaling', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Get all brands with their performance metrics
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: {
            leads: true,
            sessions: true
          }
        }
      }
    });

    // Calculate scaling metrics for each brand
    const scalingMetrics = await Promise.all(
      brands.map(async (brand) => {
        const brandLeads = await prisma.lead.findMany({
          where: { ...where, brandId: brand.id },
          include: {
            leadEvents: true
          }
        });

        const conversionRate = brandLeads.length > 0 
          ? (brandLeads.filter(lead => lead.status === 'converted').length / brandLeads.length) * 100 
          : 0;

        const averageTimeToClose = brandLeads.length > 0
          ? brandLeads.reduce((sum, lead) => sum + (lead.timeToClose || 0), 0) / brandLeads.length
          : 0;

        return {
          brandId: brand.id,
          brandName: brand.name,
          totalLeads: brandLeads.length,
          conversionRate,
          averageTimeToClose,
          averageLeadScore: brandLeads.reduce((sum, lead) => sum + lead.leadScore, 0) / brandLeads.length,
          marketCoverage: brandLeads.length > 0 ? new Set(brandLeads.map(lead => lead.zipCode)).size : 0
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalBrands: brands.length,
        averageConversionRate: scalingMetrics.reduce((sum, metric) => sum + metric.conversionRate, 0) / scalingMetrics.length,
        averageTimeToClose: scalingMetrics.reduce((sum, metric) => sum + metric.averageTimeToClose, 0) / scalingMetrics.length,
        brands: scalingMetrics
      }
    });
  } catch (error) {
    console.error('Error fetching brand scaling metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch brand scaling metrics'
    });
  }
});

// Helper functions
async function getSalesCycleMetrics(where: any) {
  const leads = await prisma.lead.findMany({
    where: { ...where, status: 'converted' },
    select: {
      createdAt: true,
      timeToClose: true,
      leadScore: true
    }
  });

  const avgTimeToClose = leads.length > 0 
    ? leads.reduce((sum, lead) => sum + (lead.timeToClose || 0), 0) / leads.length
    : 0;

  return {
    totalConverted: leads.length,
    avgTimeToClose,
    targetTimeToClose: 1.7, // SafeHaven target
    performanceVsTarget: avgTimeToClose <= 1.7 ? 'on_target' : 'below_target'
  };
}

async function getGeographicPerformance(where: any) {
  const performance = await prisma.lead.groupBy({
    by: ['zipCode'],
    where,
    _count: { id: true },
    _avg: { leadScore: true }
  });

  return performance.map(item => ({
    zipCode: item.zipCode,
    leadCount: item._count.id,
    averageScore: item._avg.leadScore,
    marketSegment: getMarketSegment(item.zipCode)
  }));
}

async function getBrandPerformance(where: any) {
  const performance = await prisma.lead.groupBy({
    by: ['brandId'],
    where,
    _count: { id: true },
    _avg: { leadScore: true, timeToClose: true }
  });

  return performance.map(item => ({
    brandId: item.brandId,
    leadCount: item._count.id,
    averageScore: item._avg.leadScore,
    averageTimeToClose: item._avg.timeToClose
  }));
}

async function getConversionRates(where: any) {
  const totalLeads = await prisma.lead.count({ where });
  const convertedLeads = await prisma.lead.count({ 
    where: { ...where, status: 'converted' } 
  });

  const teamRates = await prisma.lead.groupBy({
    by: ['salesTeam', 'status'],
    where,
    _count: { id: true }
  });

  return {
    overall: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
    byTeam: teamRates.reduce((acc, item) => {
      if (!acc[item.salesTeam]) acc[item.salesTeam] = { total: 0, converted: 0 };
      acc[item.salesTeam].total += item._count.id;
      if (item.status === 'converted') acc[item.salesTeam].converted += item._count.id;
      return acc;
    }, {} as Record<string, { total: number; converted: number }>)
  };
}

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

export default router; 