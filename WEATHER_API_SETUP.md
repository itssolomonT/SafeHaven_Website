# Weather API Setup

## Overview
The weather functionality has been successfully integrated into the brand cards. Each card now displays a small weather widget showing the current temperature and weather condition for the state's capital city.

## Features Implemented

### 1. Weather Card Component
- **Location**: `frontend/app/components/WeatherCard.tsx`
- **Features**:
  - Displays temperature and weather condition
  - Shows appropriate weather icons (sun, cloud, rain, snow, wind)
  - Loading state with spinner
  - Error handling with fallback display
  - Compact design that fits well on brand cards

### 2. Weather Service
- **Location**: `frontend/app/services/weatherService.ts`
- **Features**:
  - Real weather API integration ready (OpenWeatherMap)
  - Fallback to simulated data when API key not configured
  - State-to-capital city mapping
  - Weather icon mapping
  - Error handling and retry logic

### 3. Backend Weather API
- **Location**: `backend/src/routes/weather.ts`
- **Features**:
  - RESTful weather endpoint: `GET /api/weather/:zipCode`
  - Caching support for 30 minutes
  - OpenWeatherMap integration
  - Error handling and fallback data

## Current Implementation

### Brand Cards with Weather
Each brand card now displays:
- Company name and state
- Weather widget showing temperature and condition
- Feature list
- "Learn More" link

The weather widget appears next to the state abbreviation and shows:
- Weather icon (sun, cloud, rain, etc.)
- Temperature in Fahrenheit
- Compact design with blue background

### State Mapping
The system maps each state to its capital city for weather data:
- NC → Raleigh
- SC → Columbia
- TN → Nashville
- GA → Atlanta
- FL → Tallahassee
- AL → Montgomery

## Setup Instructions

### 1. For Real Weather Data (Optional)
To use real weather data from OpenWeatherMap:

1. Sign up for a free API key at: https://openweathermap.org/api
2. Add to your environment variables:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```
3. Uncomment the OpenWeatherMap section in `frontend/app/services/weatherService.ts`

### 2. Current Fallback System
The system currently uses simulated weather data that:
- Generates realistic temperatures (40-70°F)
- Shows appropriate weather conditions
- Updates on each page load
- Provides consistent user experience

## API Endpoints

### Frontend Weather API
- **GET** `/api/weather/:zipCode`
- Returns weather data for a specific ZIP code
- Includes temperature, condition, humidity, wind speed

### Backend Weather Cache
- **DELETE** `/api/weather/cache/:zipCode`
- Clears cached weather data for a ZIP code

## Usage Examples

### In Brand Cards
The weather widget automatically appears on each brand card:
```tsx
<WeatherCard state="NC" className="ml-2" />
```

### Standalone Usage
```tsx
import WeatherCard from './components/WeatherCard'

<WeatherCard state="SC" />
```

## Customization

### Weather Icons
Icons are mapped based on weather conditions:
- Sunny/Clear → Sun icon (yellow)
- Cloudy → Cloud icon (gray)
- Rain → Rain cloud icon (blue)
- Snow → Snow cloud icon (light blue)
- Other → Wind icon (gray)

### Styling
The weather widget uses Tailwind CSS classes:
- Background: `bg-blue-50`
- Text: `text-xs text-gray-700`
- Icons: Various colors based on condition

## Performance Considerations

1. **Caching**: Weather data is cached for 30 minutes to reduce API calls
2. **Loading States**: Smooth loading animations prevent layout shifts
3. **Error Handling**: Graceful fallbacks when weather data is unavailable
4. **Compact Design**: Minimal space usage on brand cards

## Future Enhancements

1. **Real-time Updates**: Implement WebSocket for live weather updates
2. **Forecast Data**: Add 3-5 day weather forecasts
3. **Geolocation**: Use user's actual location instead of state capitals
4. **Weather Alerts**: Show severe weather warnings
5. **Seasonal Themes**: Different styling for different seasons

## Troubleshooting

### Weather Not Loading
1. Check browser console for API errors
2. Verify backend server is running
3. Check network connectivity
4. Ensure ZIP codes are properly mapped

### API Key Issues
1. Verify API key is valid
2. Check rate limits
3. Ensure proper environment variable setup

### Styling Issues
1. Check Tailwind CSS is properly configured
2. Verify icon imports from lucide-react
3. Test responsive design on different screen sizes 