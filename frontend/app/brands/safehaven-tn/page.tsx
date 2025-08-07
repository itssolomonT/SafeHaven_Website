'use client'

import Layout from '../../components/Layout'
import { Shield, CheckCircle, Phone, Mail, MapPin, Star } from 'lucide-react'

export default function SafeHavenTN() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">SafeHaven TN</h1>
          </div>
          <p className="text-xl text-gray-600">Tennessee's most trusted security provider</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Brand Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About SafeHaven TN</h2>
              <p className="text-gray-700 mb-4">
                SafeHaven TN is Tennessee's most trusted security provider, delivering peace of mind 
                to families across the Volunteer State with cutting-edge technology and reliable service.
              </p>
              <p className="text-gray-700">
                Our wireless technology and remote access control systems provide seamless protection 
                that adapts to your lifestyle and security needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose SafeHaven TN?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Wireless Technology</h4>
                    <p className="text-gray-600">Advanced wireless security systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Remote Access Control</h4>
                    <p className="text-gray-600">Control your system from anywhere</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Response</h4>
                    <p className="text-gray-600">Rapid emergency response team</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Solutions</h4>
                    <p className="text-gray-600">Tailored to your specific needs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TN Service Areas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div>• Nashville</div>
                <div>• Memphis</div>
                <div>• Knoxville</div>
                <div>• Chattanooga</div>
                <div>• Clarksville</div>
                <div>• Murfreesboro</div>
                <div>• Franklin</div>
                <div>• Jackson</div>
              </div>
            </div>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get Your Free Quote</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">(555) 345-6789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">tn@safehaven.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Nashville, TN</span>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors mt-6">
                Get TN Quote
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "The best investment we've made for our family's safety. Excellent service!"
                  </p>
                  <p className="text-gray-600 text-xs">- David Wilson, Nashville, TN</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    "Wireless system works perfectly. No more drilling holes in my walls!"
                  </p>
                  <p className="text-gray-600 text-xs">- Jennifer Brown, Memphis, TN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 