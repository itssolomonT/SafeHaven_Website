'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, MapPin, Phone, Star, CheckCircle, Users, Clock, Award, Zap, ArrowRight, CheckCircle2, Eye } from 'lucide-react'
import BrandRouter from './components/BrandRouter'
import Layout from './components/Layout'
import DynamicPhoneNumber from './components/DynamicPhoneNumber'
import WeatherCard from './components/WeatherCard'
import axios from 'axios'

// Home page - main landing page

// Data types for location and weather
interface LocationData {
  zipCode: string
  city: string
  state: string
  county: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

interface Brand {
  id: string
  name: string
  displayName: string
  states: string[]
  zipCodes: string[]
  phoneNumber: string
  website: string
  colors: { primary: string; secondary: string }
  logo: string
  ctaText: string
  ctaColor: string
  description: string
  features: string[]
  testimonials: Array<{
    id: string
    rating: number
    text: string
    name: string
    location: string
    date: string
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function HomePage() {
  // State for ZIP code and brand data
  const [zipCode, setZipCode] = useState('')
  const [brand, setBrand] = useState<Brand | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Get user location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/location/coordinates/${latitude}/${longitude}`
            )
            if (response.data.success) {
              setZipCode(response.data.data.zipCode)
              handleZipCodeSubmit(response.data.data.zipCode)
            }
          } catch (error) {
            console.error('Error getting location:', error)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  // Handle ZIP code submission and find local brand
  const handleZipCodeSubmit = async (code: string) => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show dummy results based on ZIP code
      const dummyBrands = {
        '27000': {
          id: '1',
          name: 'safehaven-nc',
          displayName: 'SafeHaven NC',
          states: ['NC'],
          zipCodes: ['27000', '27001', '27002'],
          phoneNumber: '(919) 555-0123',
          website: 'https://safehaven-nc.com',
          colors: { primary: '#1e40af', secondary: '#3b82f6' },
          logo: '/logo-nc.png',
          ctaText: 'Get NC Security Quote',
          ctaColor: '#1e40af',
          description: 'North Carolina\'s trusted home security provider with 15+ years of experience protecting families across the state.',
          features: [
            '24/7 Professional Monitoring',
            'Smart Home Integration',
            'Mobile App Control',
            'HD Video Surveillance',
            'Environmental Monitoring'
          ],
          testimonials: [
            {
              id: '1',
              rating: 5,
              text: 'SafeHaven has been protecting our family for over 3 years. Excellent service and reliable monitoring!',
              name: 'Sarah Johnson',
              location: 'Raleigh, NC',
              date: '2024-01-15'
            },
            {
              id: '2',
              rating: 5,
              text: 'Professional installation and great customer support. Highly recommend!',
              name: 'Mike Chen',
              location: 'Charlotte, NC',
              date: '2024-01-10'
            }
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        '29000': {
          id: '2',
          name: 'safehaven-sc',
          displayName: 'SafeHaven SC',
          states: ['SC'],
          zipCodes: ['29000', '29001', '29002'],
          phoneNumber: '(803) 555-0123',
          website: 'https://safehaven-sc.com',
          colors: { primary: '#059669', secondary: '#10b981' },
          logo: '/logo-sc.png',
          ctaText: 'Get SC Security Quote',
          ctaColor: '#059669',
          description: 'South Carolina\'s leading security company, providing state-of-the-art protection for your home and family.',
          features: [
            'Advanced Detection Systems',
            'HD Video Monitoring',
            'Professional Installation',
            '24/7 Support',
            'Smart Home Integration'
          ],
          testimonials: [
            {
              id: '3',
              rating: 5,
              text: 'Best security system we\'ve ever had. The monitoring is top-notch!',
              name: 'Jennifer Brown',
              location: 'Columbia, SC',
              date: '2024-01-05'
            },
            {
              id: '4',
              rating: 5,
              text: 'Great value and excellent customer service. Highly recommend!',
              name: 'Robert Davis',
              location: 'Greenville, SC',
              date: '2024-01-08'
            }
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        '37000': {
          id: '3',
          name: 'safehaven-tn',
          displayName: 'SafeHaven TN',
          states: ['TN'],
          zipCodes: ['37000', '37001', '37002'],
          phoneNumber: '(615) 555-0123',
          website: 'https://safehaven-tn.com',
          colors: { primary: '#7c3aed', secondary: '#a855f7' },
          logo: '/logo-tn.png',
          ctaText: 'Get TN Security Quote',
          ctaColor: '#7c3aed',
          description: 'Tennessee\'s premier security provider, offering advanced protection with local expertise and personalized service.',
          features: [
            'Wireless Technology',
            'Remote Access Control',
            'Custom Solutions',
            'Local Support Team',
            'Emergency Response'
          ],
          testimonials: [
            {
              id: '5',
              rating: 5,
              text: 'SafeHaven TN exceeded our expectations. The wireless system is incredible!',
              name: 'Lisa Chen',
              location: 'Nashville, TN',
              date: '2024-01-12'
            },
            {
              id: '6',
              rating: 5,
              text: 'Professional team and reliable system. Peace of mind guaranteed!',
              name: 'David Wilson',
              location: 'Memphis, TN',
              date: '2024-01-18'
            }
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        '30000': {
          id: '4',
          name: 'topsecurity',
          displayName: 'TopSecurity',
          states: ['GA'],
          zipCodes: ['30000', '30001', '30002'],
          phoneNumber: '(555) 456-7890',
          website: 'https://topsecurity.com',
          colors: { primary: '#dc2626', secondary: '#b91c1c' },
          logo: '/logo-top.png',
          ctaText: 'Top Protection',
          ctaColor: '#dc2626',
          description: 'Georgia\'s leading security company, providing state-of-the-art protection for your home and family.',
          features: [
            'Smart Detection',
            'Cloud Storage',
            'Smart Alerts',
            'Professional Team',
            'Satisfaction Guarantee'
          ],
          testimonials: [
            {
              id: '5',
              rating: 5,
              text: 'TopSecurity exceeded our expectations. The smart features are incredible!',
              name: 'Jennifer Brown',
              location: 'Atlanta, GA',
              date: '2024-01-05'
            }
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      
      const dummyLocation = {
        zipCode: code,
        city: code === '27000' ? 'Charlotte' : code === '29000' ? 'Columbia' : code === '37000' ? 'Nashville' : 'Atlanta',
        state: code === '27000' ? 'NC' : code === '29000' ? 'SC' : code === '37000' ? 'TN' : 'GA',
        county: 'Local County',
        coordinates: { lat: 35.2271, lng: -80.8431 }
      }
      
      const dummyWeather = {
        temperature: Math.floor(Math.random() * 30) + 40,
        condition: ['Sunny', 'Partly Cloudy', 'Clear', 'Mild'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        location: dummyLocation.city
      }
      
      setBrand(dummyBrands[code as keyof typeof dummyBrands] || dummyBrands['27000'])
      setLocation(dummyLocation)
      setWeather(dummyWeather)
      setShowSuccess(true)
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000)
      
    } catch (error) {
      console.error('Error validating ZIP code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode.length === 5) {
      handleZipCodeSubmit(zipCode)
    }
  }

  return (
    <Layout zipCode={zipCode} brand={brand}>
      {/* Brand Router */}
      <BrandRouter zipCode={zipCode} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Shield className="h-4 w-4 mr-2" />
                Trusted by 50,000+ homes
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Security
                <span className="block text-blue-600">for Modern Homes</span>
            </h1>
              <p className="text-lg mb-8 text-gray-600 leading-relaxed">
                Professional home security with advanced monitoring, smart cameras, and 24/7 protection. 
                Get peace of mind with our proven technology.
            </p>

            {/* ZIP Code Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3 text-gray-700">Find your local security expert</label>
                <div className="flex max-w-md">
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter your ZIP code"
                    className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    maxLength={5}
                  />
                <button
                    onClick={() => handleZipCodeSubmit(zipCode)}
                    disabled={!zipCode || isLoading}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Finding...' : 'Get Started'}
                </button>
                    </div>
                <p className="text-xs text-gray-500 mt-2">
                  Try: <span className="font-medium">27000 (NC)</span>, <span className="font-medium">29000 (SC)</span>, <span className="font-medium">37000 (TN)</span>
                </p>
            </div>

                         {/* Success Message */}
             {showSuccess && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
               >
                  <div className="flex items-center">
                   <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                   <span className="text-green-800 font-medium">
                     Quote request submitted! We'll contact you within 24 hours.
                   </span>
                 </div>
               </motion.div>
             )}
            </motion.div>

              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Free Security Assessment</h3>
                  <p className="text-gray-600 mb-6">
                    Get a personalized security plan for your home
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <span>Professional Installation</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <span>24/7 Professional Monitoring</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <span>Smart Home Integration</span>
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>
          </div>
        </div>
      </section>

      {/* System Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Security Systems
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              State-of-the-art technology designed to protect your home and family with intelligent monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* System 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/images/system1.jpg"
                    alt="Professional Security System Installation"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Professional Installation</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Expert technicians install your security system with precision and care, ensuring optimal coverage and performance.
                  </p>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/images/system2.jpg"
                    alt="Smart Home Security Technology"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Zap className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Smart Technology</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Advanced sensors and smart cameras provide intelligent monitoring with instant alerts and remote control.
                  </p>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <span>Discover Features</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/images/system3.webp"
                    alt="24/7 Monitoring Center"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Eye className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">24/7 Monitoring</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Round-the-clock professional monitoring with rapid response times and emergency dispatch coordination.
                  </p>
                  <div className="flex items-center text-sm text-purple-600 font-medium">
                    <span>View Monitoring</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Secure Your Home?
              </h3>
              <p className="text-gray-600 mb-6">
                Get a free consultation and see how our advanced systems can protect your family
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/quote"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Get Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a
                  href="/features"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  View All Features
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Our Trusted Brands
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Serving the Southeast with specialized security solutions for each state
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'SafeHaven NC', state: 'NC', color: 'blue', path: '/brands/safehaven-nc', features: ['Local NC Team', '15+ Years Experience', '24/7 Monitoring'] },
              { name: 'SafeHaven SC', state: 'SC', color: 'green', path: '/brands/safehaven-sc', features: ['Advanced Detection', 'HD Video', 'Professional Service'] },
              { name: 'SafeHaven TN', state: 'TN', color: 'purple', path: '/brands/safehaven-tn', features: ['Wireless Tech', 'Remote Access', 'Custom Solutions'] },
              { name: 'TopSecurity', state: 'GA', color: 'red', path: '/brands/topsecurity', features: ['Smart Detection', 'Cloud Storage', 'Smart Alerts'] },
              { name: 'BestSecurity', state: 'FL', color: 'orange', path: '/brands/bestsecurity', features: ['HD Surveillance', 'Mobile Control', 'Emergency Response'] },
              { name: 'RedHawk Alarms', state: 'AL', color: 'crimson', path: '/brands/redhawk-alarms', features: ['Rapid Response', 'Local Support', 'Reliable Protection'] }
            ].map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-2 h-2 rounded-full bg-${brand.color}-500`}></div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-gray-500">{brand.state}</span>
                    <WeatherCard state={brand.state} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {brand.name}
                </h3>
                <ul className="space-y-0.5 mb-3">
                  {brand.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-2 w-2 text-green-500 mr-1 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={brand.path}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-xs group-hover:translate-x-1 transition-transform"
                >
                  Learn More
                  <ArrowRight className="h-2 w-2 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand-Specific Content */}
      {brand && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to {brand.displayName}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {brand.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Why Choose {brand.displayName}?
                </h3>
                <div className="space-y-4">
                  {brand.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Get Your Free Quote</h3>
                <p className="text-gray-600 mb-6">
                    {brand.displayName} will provide a customized security solution for your home
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <span>Free Assessment</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <span>Custom Quote</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                      <span>Professional Installation</span>
                    </div>
                  </div>
                  <a
                    href="/quote"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Testimonials */}
      {brand && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
              <p className="text-lg text-gray-600">
                Real feedback from satisfied customers across {brand.states.join(', ')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {brand.testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
        </Layout>
  )
} 