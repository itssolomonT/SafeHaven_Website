'use client'

import Layout from '../../components/Layout'
import { Shield, CheckCircle, Phone, Mail, MapPin, Star } from 'lucide-react'

export default function RedHawkAlarms() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">RedHawk Alarms</h1>
          </div>
          <p className="text-xl text-gray-600">Alabama's premier alarm system provider</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Brand Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About RedHawk Alarms</h2>
              <p className="text-gray-700 mb-4">
                RedHawk Alarms is Alabama's premier alarm system provider, specializing in 
                comprehensive security solutions for homes and businesses across the Heart of Dixie.
              </p>
              <p className="text-gray-700">
                Our advanced alarm systems and rapid response technology provide reliable protection 
                with lightning-fast emergency response times.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose RedHawk Alarms?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced Alarms</h4>
                    <p className="text-gray-600">State-of-the-art alarm technology</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Rapid Response</h4>
                    <p className="text-gray-600">Lightning-fast emergency response</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AL Licensed</h4>
                    <p className="text-gray-600">Alabama-licensed technicians</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Monitoring</h4>
                    <p className="text-gray-600">Round-the-clock protection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AL Service Areas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Birmingham</div>
                <div>• Montgomery</div>
                <div>• Huntsville</div>
                <div>• Mobile</div>
                <div>• Tuscaloosa</div>
                <div>• Auburn</div>
                <div>• Dothan</div>
                <div>• Decatur</div>
              </div>
            </div>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get Your Free Quote</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  <span className="text-gray-700">(555) 678-9012</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <span className="text-gray-700">al@redhawkalarms.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  <span className="text-gray-700">Birmingham, AL</span>
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-6">
                Get AL Quote
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "RedHawk's response time is incredible. They were here in under 3 minutes!"
                  </p>
                  <p className="text-gray-600 text-xs">- Robert Johnson, Birmingham, AL</p>
                </div>
                <div className="border-l-4 border-indigo-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "Best alarm system we've ever had. The monitoring is top-notch."
                  </p>
                  <p className="text-gray-600 text-xs">- Lisa Williams, Montgomery, AL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 