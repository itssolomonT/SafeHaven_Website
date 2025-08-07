"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const router = express_1.default.Router();
// Get weather by ZIP code
router.get('/:zipCode', async (req, res) => {
    try {
        const { zipCode } = req.params;
        // Check cache first
        const cachedWeather = await index_1.prisma.weatherCache.findUnique({
            where: { zipCode }
        });
        if (cachedWeather && cachedWeather.expiresAt > new Date()) {
            return res.json({
                success: true,
                data: cachedWeather.data
            });
        }
        // Fetch from weather API (using OpenWeatherMap as example)
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'Weather API key not configured'
            });
        }
        const response = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`);
        const weatherData = {
            temperature: response.data.main.temp,
            condition: response.data.weather[0].main,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            location: response.data.name
        };
        // Cache the result for 30 minutes
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        await index_1.prisma.weatherCache.upsert({
            where: { zipCode },
            update: {
                data: weatherData,
                expiresAt
            },
            create: {
                zipCode,
                data: weatherData,
                expiresAt
            }
        });
        res.json({
            success: true,
            data: weatherData
        });
    }
    catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch weather data'
        });
    }
});
// Clear weather cache
router.delete('/cache/:zipCode', async (req, res) => {
    try {
        const { zipCode } = req.params;
        await index_1.prisma.weatherCache.delete({
            where: { zipCode }
        });
        res.json({
            success: true,
            message: 'Weather cache cleared'
        });
    }
    catch (error) {
        console.error('Error clearing weather cache:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear weather cache'
        });
    }
});
exports.default = router;
//# sourceMappingURL=weather.js.map