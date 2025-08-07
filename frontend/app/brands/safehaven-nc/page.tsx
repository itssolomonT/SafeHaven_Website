'use client'

import Layout from '../../components/Layout'
import { Shield, CheckCircle, Phone, Mail, MapPin, Star } from 'lucide-react'

export default function SafeHavenNC() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">SafeHaven NC</h1>
          </div>
          <p className="text-xl text-gray-600">North Carolina's trusted security provider</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Brand Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About SafeHaven NC</h2>
              <p className="text-gray-700 mb-4">
                SafeHaven NC has been protecting families across North Carolina for over 15 years. 
                We specialize in custom security solutions designed for the unique needs of NC homeowners.
              </p>
              <p className="text-gray-700">
                Our local team understands the specific security challenges faced by North Carolina residents 
                and provides personalized solutions backed by 24/7 professional monitoring.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose SafeHaven NC?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                    <h4 className="font-semibold text-gray-900">Local NC Team</h4>
                    <p className="text-gray-600">Licensed technicians who know NC regulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">15+ Years Experience</h4>
                    <p className="text-gray-600">Proven track record in NC security</p>
              </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Monitoring</h4>
                    <p className="text-gray-600">Professional monitoring center</p>
              </div>
              </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                    <h4 className="font-semibold text-gray-900">Free Installation</h4>
                    <p className="text-gray-600">No hidden fees or charges</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NC Service Areas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Charlotte</div>
                <div>• Raleigh</div>
                <div>• Greensboro</div>
                <div>• Winston-Salem</div>
                <div>• Durham</div>
                <div>• Fayetteville</div>
                <div>• Wilmington</div>
                <div>• Asheville</div>
        </div>
            </div>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get Your Free Quote</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">nc@safehaven.com</span>
            </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Charlotte, NC</span>
            </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6">
                Get NC Quote
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
          </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "SafeHaven NC installed our system quickly and professionally. The mobile app is amazing!"
                  </p>
                  <p className="text-gray-600 text-xs">- Sarah Johnson, Charlotte, NC</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "Best security system we've ever had. The monitoring team is always responsive."
                  </p>
                  <p className="text-gray-600 text-xs">- Mike Davis, Raleigh, NC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </Layout>
  )
} 