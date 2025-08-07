'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye } from 'lucide-react'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  uvIndex: number
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
  }>
}

interface WeatherDisplayProps {
  zipCode?: string
  className?: string
}

export default function WeatherDisplay({ zipCode, className = '' }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (zipCode) {
      fetchWeather(zipCode)
    }
  }, [zipCode])

  const fetchWeather = async (code: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/weather/${code}`)
      const data = await response.json()
      
      if (data.success) {
        setWeather(data.data)
      } else {
        setError('Unable to fetch weather data')
      }
    } catch (err) {
      setError('Weather service unavailable')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <Sun className="w-6 h-6 text-yellow-500" />
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return <Cloud className="w-6 h-6 text-gray-400" />
    } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
      return <CloudRain className="w-6 h-6 text-blue-500" />
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow className="w-6 h-6 text-blue-300" />
    } else {
      return <Cloud className="w-6 h-6 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg shadow-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading weather...</span>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg shadow-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-center text-red-500">
          <Cloud className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      </motion.div>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
    >
      {/* Current Weather */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {Math.round(weather.temperature)}°F
        </div>
        <div className="text-gray-600 mb-4">
          {weather.condition}
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            Humidity: {weather.humidity}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Wind: {weather.windSpeed} mph
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Visibility: {weather.visibility} mi
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-600">
            UV Index: {weather.uvIndex}
          </span>
        </div>
      </div>

      {/* Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">3-Day Forecast</h4>
          <div className="space-y-2">
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{day.day}</span>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(day.condition)}
                  <span className="text-gray-900">
                    {day.high}° / {day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Security Alert */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-blue-700">
            Local weather conditions may affect security system performance
          </span>
        </div>
      </div>
    </motion.div>
  )
} 