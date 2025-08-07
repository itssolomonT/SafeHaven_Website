"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
// Import routes
const brands_1 = __importDefault(require("./routes/brands"));
const leads_1 = __importDefault(require("./routes/leads"));
const sessions_1 = __importDefault(require("./routes/sessions"));
const weather_1 = __importDefault(require("./routes/weather"));
const location_1 = __importDefault(require("./routes/location"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Initialize Prisma
exports.prisma = new client_1.PrismaClient();
// Initialize Redis (optional)
let redis = null;
try {
    const Redis = require('redis');
    redis = Redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    redis.connect().catch(console.error);
}
catch (error) {
    console.log('Redis not available, continuing without cache');
}
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
// Compression and logging
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: 'connected',
            redis: redis?.isReady ? 'connected' : 'disconnected'
        }
    });
});
// API routes
app.use('/api/brands', brands_1.default);
app.use('/api/leads', leads_1.default);
app.use('/api/sessions', sessions_1.default);
app.use('/api/weather', weather_1.default);
app.use('/api/location', location_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await exports.prisma.$disconnect();
    if (redis)
        await redis.quit();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await exports.prisma.$disconnect();
    if (redis)
        await redis.quit();
    process.exit(0);
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 SafeHaven API server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map