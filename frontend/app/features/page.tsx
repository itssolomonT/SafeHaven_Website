'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Camera, 
  Smartphone, 
  Wifi, 
  Zap, 
  Lock, 
  Eye, 
  Bell, 
  Home, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Globe,
  Smartphone as Mobile,
  Monitor,
  Database,
  Cloud,
  AlertTriangle,
  Heart,
  MapPin
} from 'lucide-react'
import Layout from '../components/Layout'
import { useMultiBrand } from '../components/MultiBrandProvider'

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'monitoring' | 'technology' | 'security' | 'smart-home' | 'support'
  benefits: string[]
  available: boolean
}

export default function FeaturesPage() {
  const { currentBrand } = useMultiBrand()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const features: Feature[] = [
    {
      id: '24-7-monitoring',
      title: '24/7 Professional Monitoring',
      description: 'Round-the-clock monitoring by certified security professionals who respond to alarms within seconds.',
      icon: <Eye className="w-6 h-6" />,
      category: 'monitoring',
      benefits: [
        'Instant alarm response',
        'Certified monitoring staff',
        'Emergency dispatch coordination',
        'False alarm verification'
      ],
      available: true
    },
    {
      id: 'smart-home-integration',
      title: 'Smart Home Integration',
      description: 'Seamlessly integrate with your existing smart home devices for complete home automation.',
      icon: <Home className="w-6 h-6" />,
      category: 'smart-home',
      benefits: [
        'Alexa & Google Assistant',
        'Smart thermostat control',
        'Lighting automation',
        'Voice commands'
      ],
      available: true
    },
    {
      id: 'mobile-app-control',
      title: 'Mobile App Control',
      description: 'Control your security system from anywhere with our intuitive mobile application.',
      icon: <Mobile className="w-6 h-6" />,
      category: 'technology',
      benefits: [
        'Remote arm/disarm',
        'Real-time alerts',
        'Video streaming',
        'User management'
      ],
      available: true
    },
    {
      id: 'hd-video-surveillance',
      title: 'HD Video Surveillance',
      description: 'Crystal clear video monitoring with night vision and motion detection capabilities.',
      icon: <Camera className="w-6 h-6" />,
      category: 'security',
      benefits: [
        '1080p HD resolution',
        'Night vision up to 100ft',
        'Motion detection',
        'Cloud storage'
      ],
      available: true
    },
    {
      id: 'wireless-technology',
      title: 'Wireless Technology',
      description: 'Advanced wireless sensors and communication for easy installation and reliable operation.',
      icon: <Wifi className="w-6 h-6" />,
      category: 'technology',
      benefits: [
        'Easy installation',
        'No drilling required',
        'Battery backup',
        'Encrypted communication'
      ],
      available: true
    },
    {
      id: 'environmental-monitoring',
      title: 'Environmental Monitoring',
      description: 'Protect against fire, carbon monoxide, and water damage with comprehensive sensors.',
      icon: <AlertTriangle className="w-6 h-6" />,
      category: 'security',
      benefits: [
        'Smoke detection',
        'Carbon monoxide monitoring',
        'Water leak detection',
        'Temperature monitoring'
      ],
      available: true
    },
    {
      id: 'ai-powered-detection',
      title: 'AI-Powered Detection',
      description: 'Advanced artificial intelligence that learns your patterns and reduces false alarms.',
      icon: <Zap className="w-6 h-6" />,
      category: 'technology',
      benefits: [
        'Pattern recognition',
        'False alarm reduction',
        'Smart notifications',
        'Predictive analytics'
      ],
      available: true
    },
    {
      id: 'cloud-storage',
      title: 'Cloud Storage',
      description: 'Secure cloud storage for video recordings and system data with automatic backup.',
      icon: <Cloud className="w-6 h-6" />,
      category: 'technology',
      benefits: [
        '30-day video storage',
        'Automatic backup',
        'Secure encryption',
        'Easy access'
      ],
      available: true
    },
    {
      id: 'local-support',
      title: 'Local Support Team',
      description: 'Dedicated local technicians and support staff for personalized service.',
      icon: <Users className="w-6 h-6" />,
      category: 'support',
      benefits: [
        'Local technicians',
        'Same-day service',
        'Personalized support',
        'Community presence'
      ],
      available: true
    },
    {
      id: 'rapid-response',
      title: 'Rapid Response',
      description: 'Quick response times with local monitoring centers and emergency protocols.',
      icon: <Clock className="w-6 h-6" />,
      category: 'support',
      benefits: [
        '< 30 second response',
        'Local monitoring centers',
        'Emergency protocols',
        'Police coordination'
      ],
      available: true
    }
  ]

  const categories = [
    { id: 'all', name: 'All Features', icon: <Shield className="w-4 h-4" /> },
    { id: 'monitoring', name: 'Monitoring', icon: <Eye className="w-4 h-4" /> },
    { id: 'technology', name: 'Technology', icon: <Zap className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'smart-home', name: 'Smart Home', icon: <Home className="w-4 h-4" /> },
    { id: 'support', name: 'Support', icon: <Users className="w-4 h-4" /> }
  ]

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory)

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Security Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the cutting-edge technology and comprehensive protection that keeps your family safe 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {feature.description}
                    </p>
                    
                    {activeFeature === feature.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <h4 className="font-medium text-gray-900 text-sm">Key Benefits:</h4>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">
                        Click to {activeFeature === feature.id ? 'hide' : 'learn more'}
                      </span>
                      {feature.available && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Technology?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced security systems combine cutting-edge technology with proven reliability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Reliability</h3>
              <p className="text-gray-600">
                99.9% uptime with redundant systems and backup power to ensure your protection never stops.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Leading</h3>
              <p className="text-gray-600">
                Award-winning technology and service recognized by industry experts and satisfied customers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Future Ready</h3>
              <p className="text-gray-600">
                Continuously updated with the latest security innovations and smart home integrations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Advanced Security?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get a free consultation and see how our features can protect your family
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/quote"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
} 