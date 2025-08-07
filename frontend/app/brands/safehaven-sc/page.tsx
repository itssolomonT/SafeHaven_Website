'use client'

import Layout from '../../components/Layout'
import { Shield, CheckCircle, Phone, Mail, MapPin, Star } from 'lucide-react'

export default function SafeHavenSC() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">SafeHaven SC</h1>
          </div>
          <p className="text-xl text-gray-600">South Carolina's premier security company</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Brand Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About SafeHaven SC</h2>
              <p className="text-gray-700 mb-4">
                SafeHaven SC is South Carolina's premier security company, providing cutting-edge 
                protection for homes and businesses across the Palmetto State.
              </p>
              <p className="text-gray-700">
                Our advanced detection systems and HD video surveillance technology ensure your 
                property is protected with the latest security innovations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose SafeHaven SC?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced Detection</h4>
                    <p className="text-gray-600">Latest motion and sensor technology</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">HD Video Surveillance</h4>
                    <p className="text-gray-600">Crystal clear video monitoring</p>
                  </div>
              </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Professional Service</h4>
                    <p className="text-gray-600">Licensed SC technicians</p>
            </div>
        </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Lifetime Warranty</h4>
                    <p className="text-gray-600">Comprehensive coverage included</p>
              </div>
              </div>
              </div>
              </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SC Service Areas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Columbia</div>
                <div>• Charleston</div>
                <div>• Greenville</div>
                <div>• Myrtle Beach</div>
                <div>• Spartanburg</div>
                <div>• Rock Hill</div>
                <div>• Sumter</div>
                <div>• Florence</div>
              </div>
            </div>
        </div>

          {/* Contact & CTA */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get Your Free Quote</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">(555) 234-5678</span>
            </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">sc@safehaven.com</span>
            </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Columbia, SC</span>
            </div>
              </div>
              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors mt-6">
                Get SC Quote
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
          </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "Outstanding service from start to finish. Highly recommend SafeHaven SC!"
                  </p>
                  <p className="text-gray-600 text-xs">- Lisa Thompson, Columbia, SC</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "The HD cameras are incredible. I can check my home from anywhere."
                  </p>
                  <p className="text-gray-600 text-xs">- John Smith, Charleston, SC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </Layout>
  )
} 