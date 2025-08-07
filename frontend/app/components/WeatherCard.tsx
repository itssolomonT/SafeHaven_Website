'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react'
import { fetchWeatherData } from '../services/weatherService'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

interface WeatherCardProps {
  state: string
  className?: string
}

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase()
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return <Sun className="h-3 w-3 text-yellow-500" />
  } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
    return <Cloud className="h-3 w-3 text-gray-500" />
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return <CloudRain className="h-3 w-3 text-blue-500" />
  } else if (conditionLower.includes('snow')) {
    return <CloudSnow className="h-3 w-3 text-blue-300" />
  } else {
    return <Wind className="h-3 w-3 text-gray-400" />
  }
}

const getStateZipCode = (state: string): string => {
  const zipCodes: { [key: string]: string } = {
    'NC': '27000', // Raleigh area
    'SC': '29000', // Columbia area
    'TN': '37000', // Nashville area
    'GA': '30000', // Atlanta area
    'FL': '32000', // Tallahassee area
    'AL': '36000'  // Montgomery area
  }
  return zipCodes[state] || '27000'
}

export default function WeatherCard({ state, className = '' }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError('')
        
        const weatherData = await fetchWeatherData(state)
        setWeather(weatherData)
      } catch (error) {
        console.error('Error fetching weather:', error)
        setError('Weather unavailable')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [state, mounted])

  if (!mounted) {
    return (
      <div className={`flex items-center px-1 py-0.5 bg-gray-50 rounded text-xs text-gray-400 ${className}`}>
        <Thermometer className="h-2 w-2 mr-1" />
        <span>--°</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center px-1 py-0.5 bg-gray-50 rounded text-xs text-gray-500 ${className}`}>
        <div className="animate-spin rounded-full h-2 w-2 border-b border-gray-400"></div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className={`flex items-center px-1 py-0.5 bg-gray-50 rounded text-xs text-gray-400 ${className}`}>
        <Thermometer className="h-2 w-2 mr-1" />
        <span>--°</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-1 px-1 py-0.5 bg-blue-50 rounded text-xs ${className}`}>
      {getWeatherIcon(weather.condition)}
      <span className="font-medium text-gray-700">{Math.round(weather.temperature)}°</span>
    </div>
  )
} 