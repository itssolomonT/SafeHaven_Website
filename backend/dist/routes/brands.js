"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const shared_1 = require("@safehaven/shared");
const router = express_1.default.Router();
// Get all brands with enhanced filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, state, isActive, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
        const where = {};
        if (state) {
            where.states = { has: state };
        }
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { displayName: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const brands = await index_1.prisma.brand.findMany({
            where,
            include: {
                _count: {
                    select: {
                        leads: true,
                        sessions: true
                    }
                }
            },
            orderBy: { [sortBy]: sortOrder },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });
        const total = await index_1.prisma.brand.count({ where });
        res.json({
            success: true,
            data: brands,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch brands'
        });
    }
});
// Get brand by ID with detailed analytics
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { includeAnalytics = 'false' } = req.query;
        const brand = await index_1.prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        leads: true,
                        sessions: true
                    }
                }
            }
        });
        if (!brand) {
            return res.status(404).json({
                success: false,
                error: 'Brand not found'
            });
        }
        let analytics = null;
        if (includeAnalytics === 'true') {
            analytics = await getBrandAnalytics(id);
        }
        res.json({
            success: true,
            data: {
                brand,
                analytics
            }
        });
    }
    catch (error) {
        console.error('Error fetching brand:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch brand'
        });
    }
});
// Get brand by ZIP code with service area validation
router.get('/zip/:zipCode', async (req, res) => {
    try {
        const { zipCode } = req.params;
        const { includeServiceArea = 'false' } = req.query;
        // First try to find in database
        let brand = await index_1.prisma.brand.findFirst({
            where: {
                zipCodes: { has: zipCode.substring(0, 3) },
                isActive: true
            },
            include: {
                _count: {
                    select: {
                        leads: true,
                        sessions: true
                    }
                }
            }
        });
        // Fallback to shared brands if not in database
        if (!brand) {
            const sharedBrand = (0, shared_1.getBrandByZipCode)(zipCode);
            if (sharedBrand) {
                brand = {
                    id: sharedBrand.id,
                    name: sharedBrand.name,
                    displayName: sharedBrand.displayName,
                    states: sharedBrand.states,
                    zipCodes: sharedBrand.zipCodes,
                    phoneNumber: sharedBrand.phoneNumber,
                    website: sharedBrand.website,
                    colors: sharedBrand.colors,
                    logo: sharedBrand.logo,
                    ctaText: sharedBrand.ctaText,
                    ctaColor: sharedBrand.ctaColor,
                    description: sharedBrand.description,
                    features: sharedBrand.features,
                    testimonials: sharedBrand.testimonials,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    _count: {
                        leads: 0,
                        sessions: 0
                    }
                };
            }
        }
        if (!brand) {
            return res.status(404).json({
                success: false,
                error: 'No brand found for this ZIP code'
            });
        }
        let serviceArea = null;
        if (includeServiceArea === 'true') {
            serviceArea = await getServiceAreaInfo(brand.id, zipCode);
        }
        res.json({
            success: true,
            data: {
                brand,
                serviceArea
            }
        });
    }
    catch (error) {
        console.error('Error fetching brand by ZIP:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch brand by ZIP'
        });
    }
});
// Create new brand (admin only)
router.post('/', async (req, res) => {
    try {
        const { name, displayName, states, zipCodes, phoneNumber, website, colors, logo, ctaText, ctaColor, description, features, testimonials } = req.body;
        const brand = await index_1.prisma.brand.create({
            data: {
                name,
                displayName,
                states,
                zipCodes,
                phoneNumber,
                website,
                colors,
                logo,
                ctaText,
                ctaColor,
                description,
                features,
                testimonials,
                isActive: true
            }
        });
        res.status(201).json({
            success: true,
            data: brand
        });
    }
    catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create brand'
        });
    }
});
// Update brand
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const brand = await index_1.prisma.brand.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            data: brand
        });
    }
    catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update brand'
        });
    }
});
// Deactivate brand (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await index_1.prisma.brand.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({
            success: true,
            data: brand
        });
    }
    catch (error) {
        console.error('Error deactivating brand:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to deactivate brand'
        });
    }
});
// Get brand performance metrics
router.get('/:id/performance', async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;
        const where = { brandId: id };
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        const [leads, sessions, conversionRate, avgLeadScore] = await Promise.all([
            index_1.prisma.lead.count({ where }),
            index_1.prisma.session.count({ where }),
            calculateBrandConversionRate(id, startDate, endDate),
            index_1.prisma.lead.aggregate({
                where,
                _avg: { leadScore: true }
            })
        ]);
        res.json({
            success: true,
            data: {
                leads,
                sessions,
                conversionRate,
                avgLeadScore: avgLeadScore._avg.leadScore || 0
            }
        });
    }
    catch (error) {
        console.error('Error fetching brand performance:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch brand performance'
        });
    }
});
// Get brand service areas
router.get('/:id/service-areas', async (req, res) => {
    try {
        const { id } = req.params;
        const serviceAreas = await index_1.prisma.serviceArea.findMany({
            where: { brandId: id, isActive: true }
        });
        res.json({
            success: true,
            data: serviceAreas
        });
    }
    catch (error) {
        console.error('Error fetching service areas:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service areas'
        });
    }
});
// Helper functions
async function getBrandAnalytics(brandId) {
    const [leads, sessions, conversionRate, topZipCodes] = await Promise.all([
        index_1.prisma.lead.count({ where: { brandId } }),
        index_1.prisma.session.count({ where: { brandId } }),
        calculateBrandConversionRate(brandId),
        index_1.prisma.lead.groupBy({
            by: ['zipCode'],
            where: { brandId },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        })
    ]);
    return {
        totalLeads: leads,
        totalSessions: sessions,
        conversionRate,
        topZipCodes
    };
}
async function getServiceAreaInfo(brandId, zipCode) {
    const serviceArea = await index_1.prisma.serviceArea.findFirst({
        where: {
            brandId,
            zipCodes: { has: zipCode.substring(0, 3) },
            isActive: true
        }
    });
    return {
        isInServiceArea: !!serviceArea,
        coverage: serviceArea ? 'full' : 'partial',
        estimatedResponseTime: serviceArea ? '24 hours' : '48 hours'
    };
}
async function calculateBrandConversionRate(brandId, startDate, endDate) {
    const where = { brandId };
    if (startDate && endDate) {
        where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate)
        };
    }
    const [totalLeads, convertedLeads] = await Promise.all([
        index_1.prisma.lead.count({ where }),
        index_1.prisma.lead.count({
            where: {
                ...where,
                status: 'converted'
            }
        })
    ]);
    return totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
}
exports.default = router;
//# sourceMappingURL=brands.js.map