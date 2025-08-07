interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
  icon?: string
}

const getStateCapital = (state: string): string => {
  const capitals: { [key: string]: string } = {
    'NC': 'Raleigh',
    'SC': 'Columbia', 
    'TN': 'Nashville',
    'GA': 'Atlanta',
    'FL': 'Tallahassee',
    'AL': 'Montgomery'
  }
  return capitals[state] || 'Unknown'
}

const getStateCoordinates = (state: string): { lat: number; lon: number } => {
  const coordinates: { [key: string]: { lat: number; lon: number } } = {
    'NC': { lat: 35.7796, lon: -78.6382 }, // Raleigh
    'SC': { lat: 34.0007, lon: -81.0348 }, // Columbia
    'TN': { lat: 36.1627, lon: -86.7816 }, // Nashville
    'GA': { lat: 33.7490, lon: -84.3880 }, // Atlanta
    'FL': { lat: 30.4383, lon: -84.2807 }, // Tallahassee
    'AL': { lat: 32.3792, lon: -86.3077 }  // Montgomery
  }
  return coordinates[state] || { lat: 35.7796, lon: -78.6382 }
}

export async function fetchWeatherData(state: string): Promise<WeatherData> {
  const capital = getStateCapital(state)
  const coords = getStateCoordinates(state)
  
  try {
    // If you have an OpenWeatherMap API key, uncomment this section
    /*
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    if (!apiKey) {
      throw new Error('Weather API key not configured')
    }
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial`
    )
    
    if (!response.ok) {
      throw new Error('Weather API request failed')
    }
    
    const data = await response.json()
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      location: capital,
      icon: data.weather[0].icon
    }
    */
    
    // Fallback to simulated weather data
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const conditions = ['Sunny', 'Partly Cloudy', 'Clear', 'Mild', 'Cloudy']
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
    
    return {
      temperature: Math.floor(Math.random() * 30) + 40, // 40-70°F
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
      location: capital
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    
    // Return fallback data
    return {
      temperature: 65,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 8,
      location: capital
    }
  }
}

export function getWeatherIcon(condition: string): string {
  const conditionLower = condition.toLowerCase()
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return '☀️'
  } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
    return '☁️'
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return '🌧️'
  } else if (conditionLower.includes('snow')) {
    return '❄️'
  } else if (conditionLower.includes('thunder')) {
    return '⛈️'
  } else {
    return '🌤️'
  }
} 