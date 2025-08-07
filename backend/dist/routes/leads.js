"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
// Create new lead with enhanced tracking
router.post('/', async (req, res) => {
    try {
        const { brandId, firstName, lastName, email, phone, zipCode, address, source, utmParams, sessionId, conversionType, // 'phone_call', 'form_submit', 'chat', 'quote_request'
        deviceType, // 'mobile', 'desktop', 'tablet'
        pageUrl, timeOnPage, scrollDepth, previousVisits } = req.body;
        // Enhanced lead data with conversion tracking
        const lead = await index_1.prisma.lead.create({
            data: {
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
                // Track sales cycle metrics
                leadScore: calculateLeadScore({
                    source,
                    deviceType,
                    timeOnPage,
                    scrollDepth,
                    previousVisits,
                    utmParams
                }),
                expectedCloseTime: calculateExpectedCloseTime(source, utmParams),
                priority: calculatePriority(source, utmParams)
            },
            include: {
                brand: true,
                session: true
            }
        });
        // Track lead creation event for analytics
        await index_1.prisma.leadEvent.create({
            data: {
                leadId: lead.id,
                eventType: 'lead_created',
                eventData: {
                    source,
                    conversionType,
                    deviceType,
                    utmParams
                }
            }
        });
        res.status(201).json({
            success: true,
            data: lead
        });
    }
    catch (error) {
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
        const where = { brandId };
        if (status) {
            where.status = status;
        }
        const leads = await index_1.prisma.lead.findMany({
            where,
            include: {
                brand: true,
                session: true
            },
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });
        const total = await index_1.prisma.lead.count({ where });
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
    }
    catch (error) {
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
        const lead = await index_1.prisma.lead.findUnique({
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
    }
    catch (error) {
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
        const lead = await index_1.prisma.lead.update({
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
    }
    catch (error) {
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
        const where = { brandId };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        // Comprehensive analytics for scaling across 30+ brands
        const [totalLeads, newLeads, convertedLeads, rejectedLeads, avgLeadScore, avgTimeToClose, conversionBySource, conversionByDevice, conversionByZipCode, dailyTrends, salesCycleMetrics] = await Promise.all([
            index_1.prisma.lead.count({ where }),
            index_1.prisma.lead.count({ where: { ...where, status: 'new' } }),
            index_1.prisma.lead.count({ where: { ...where, status: 'converted' } }),
            index_1.prisma.lead.count({ where: { ...where, status: 'rejected' } }),
            index_1.prisma.lead.aggregate({
                where,
                _avg: { leadScore: true }
            }),
            index_1.prisma.lead.aggregate({
                where: { ...where, status: 'converted' },
                _avg: {
                    timeToClose: true
                }
            }),
            index_1.prisma.lead.groupBy({
                by: ['source'],
                where,
                _count: { id: true },
                _avg: { leadScore: true }
            }),
            index_1.prisma.lead.groupBy({
                by: ['deviceType'],
                where,
                _count: { id: true },
                _avg: { leadScore: true }
            }),
            index_1.prisma.lead.groupBy({
                by: ['zipCode'],
                where,
                _count: { id: true },
                _avg: { leadScore: true }
            }),
            index_1.prisma.lead.groupBy({
                by: ['createdAt'],
                where,
                _count: { id: true }
            }),
            getSalesCycleMetrics(brandId, startDate, endDate)
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
    }
    catch (error) {
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
        const where = { zipCode };
        if (brandId) {
            where.brandId = brandId;
        }
        const performance = await index_1.prisma.lead.groupBy({
            by: ['brandId', 'status'],
            where,
            _count: { id: true },
            _avg: { leadScore: true, timeToClose: true }
        });
        res.json({
            success: true,
            data: performance
        });
    }
    catch (error) {
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
        const event = await index_1.prisma.leadEvent.create({
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
    }
    catch (error) {
        console.error('Error creating lead event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create lead event'
        });
    }
});
// Helper functions for lead scoring and prioritization
function calculateLeadScore(data) {
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
    score += sourceScores[data.source] || 5;
    // Device scoring
    if (data.deviceType === 'mobile')
        score += 5; // Mobile users more likely to convert
    if (data.deviceType === 'desktop')
        score += 3;
    // Engagement scoring
    if (data.timeOnPage > 300)
        score += 10; // 5+ minutes
    if (data.scrollDepth > 75)
        score += 8; // Deep scroll
    if (data.previousVisits > 0)
        score += 15; // Return visitor
    // UTM parameter scoring
    if (data.utmParams?.campaign?.includes('high-intent'))
        score += 20;
    if (data.utmParams?.term?.includes('quote'))
        score += 15;
    return Math.min(score, 100); // Cap at 100
}
function calculateExpectedCloseTime(source, utmParams) {
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
    const multiplier = sourceMultipliers[source] || 1.0;
    // Adjust based on UTM parameters
    if (utmParams?.campaign?.includes('urgent'))
        return baseTime * 0.5;
    if (utmParams?.term?.includes('quote'))
        return baseTime * 0.8;
    return baseTime * multiplier;
}
function calculatePriority(source, utmParams) {
    if (source === 'paid_search' || source === 'referral')
        return 'high';
    if (utmParams?.campaign?.includes('high-intent'))
        return 'high';
    if (source === 'organic_search')
        return 'medium';
    return 'low';
}
async function getSalesCycleMetrics(brandId, startDate, endDate) {
    const where = { brandId };
    if (startDate && endDate) {
        where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate)
        };
    }
    const [avgTimeToClose, avgTimeToRejection, conversionByDay] = await Promise.all([
        index_1.prisma.lead.aggregate({
            where: { ...where, status: 'converted' },
            _avg: { timeToClose: true }
        }),
        index_1.prisma.lead.aggregate({
            where: { ...where, status: 'rejected' },
            _avg: { timeToRejection: true }
        }),
        index_1.prisma.lead.groupBy({
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
exports.default = router;
//# sourceMappingURL=leads.js.map