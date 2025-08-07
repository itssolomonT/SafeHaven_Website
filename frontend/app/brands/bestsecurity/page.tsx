'use client'

import Layout from '../../components/Layout'
import { Shield, CheckCircle, Phone, Mail, MapPin, Star } from 'lucide-react'

export default function BestSecurity() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">BestSecurity</h1>
          </div>
          <p className="text-xl text-gray-600">Florida's most trusted security provider</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Brand Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About BestSecurity</h2>
              <p className="text-gray-700 mb-4">
                BestSecurity is Florida's most trusted security provider, delivering comprehensive 
                protection for homes and businesses across the Sunshine State.
              </p>
              <p className="text-gray-700">
                Our hurricane-resistant systems and coastal protection technology ensure your 
                property is protected from both security threats and Florida's unique weather challenges.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose BestSecurity?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Hurricane-Resistant</h4>
                    <p className="text-gray-600">Built to withstand Florida weather</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Coastal Protection</h4>
                    <p className="text-gray-600">Salt-resistant equipment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Local FL Team</h4>
                    <p className="text-gray-600">Florida-licensed technicians</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Response</h4>
                    <p className="text-gray-600">24/7 emergency monitoring</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">FL Service Areas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Miami</div>
                <div>• Orlando</div>
                <div>• Tampa</div>
                <div>• Jacksonville</div>
                <div>• Fort Lauderdale</div>
                <div>• West Palm Beach</div>
                <div>• Sarasota</div>
                <div>• Naples</div>
              </div>
            </div>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get Your Free Quote</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">(555) 567-8901</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">fl@bestsecurity.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">Miami, FL</span>
                </div>
              </div>
              <button className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors mt-6">
                Get FL Quote
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "BestSecurity handled our hurricane protection perfectly. No damage during the storm!"
                  </p>
                  <p className="text-gray-600 text-xs">- Carlos Rodriguez, Miami, FL</p>
                </div>
                <div className="border-l-4 border-orange-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "Coastal protection is excellent. No rust issues after 2 years near the beach."
                  </p>
                  <p className="text-gray-600 text-xs">- Maria Garcia, Tampa, FL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 