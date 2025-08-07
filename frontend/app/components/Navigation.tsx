'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown, Menu, X, Phone, Search, User, ShoppingCart } from 'lucide-react'
import DynamicPhoneNumber from './DynamicPhoneNumber'

export default function Navigation() {
  // Mobile menu and brands dropdown state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBrandsOpen, setIsBrandsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const brands = [
    { name: 'SafeHaven NC', path: '/brands/safehaven-nc', state: 'NC', color: 'blue' },
    { name: 'SafeHaven SC', path: '/brands/safehaven-sc', state: 'SC', color: 'green' },
    { name: 'SafeHaven TN', path: '/brands/safehaven-tn', state: 'TN', color: 'purple' },
    { name: 'TopSecurity', path: '/brands/topsecurity', state: 'GA', color: 'red' },
    { name: 'BestSecurity', path: '/brands/bestsecurity', state: 'FL', color: 'orange' },
    { name: 'RedHawk Alarms', path: '/brands/redhawk-alarms', state: 'AL', color: 'crimson' }
  ]

  // Don't render AnimatePresence until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>Free Installation</span>
                <span>24/7 Monitoring</span>
                <span>No Long-term Contracts</span>
              </div>
              <div className="flex items-center space-x-4">
                <DynamicPhoneNumber defaultNumber="(555) 123-4567" className="text-sm text-gray-600 hover:text-primary-600" />
                <a href="/contact" className="text-sm text-gray-600 hover:text-primary-600">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Shield className="h-10 w-10 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                SafeHaven Security
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </a>
              <a href="/quote" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Get Quote
              </a>
              <a href="/features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Features
              </a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Support
              </a>
              <DynamicPhoneNumber
                defaultNumber="(555) 123-4567"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </DynamicPhoneNumber>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>Free Installation</span>
              <span>24/7 Monitoring</span>
              <span>No Long-term Contracts</span>
            </div>
            <div className="flex items-center space-x-4">
              <DynamicPhoneNumber defaultNumber="(555) 123-4567" className="text-sm text-gray-600 hover:text-primary-600" />
              <a href="/contact" className="text-sm text-gray-600 hover:text-primary-600">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Shield className="h-10 w-10 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              SafeHaven Security
            </h1>
          </div>

                     {/* Desktop Navigation */}
           <div className="hidden lg:flex items-center space-x-6">
             <a href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
               Home
             </a>
             
             {/* Brands Dropdown */}
             <div className="relative">
               <button
                 onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                 className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
               >
                 <span>Our Brands</span>
                 <ChevronDown className={`h-4 w-4 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
               </button>
               
               <AnimatePresence>
                 {isBrandsOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-3"
                   >
                     <div className="grid grid-cols-2 gap-1">
                       {brands.map((brand) => (
                         <a
                           key={brand.path}
                           href={brand.path}
                           className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded"
                         >
                           <div className={`w-3 h-3 rounded-full bg-${brand.color}-500`}></div>
                           <div>
                             <p className="font-medium text-gray-900">{brand.name}</p>
                             <p className="text-sm text-gray-500">{brand.state}</p>
                           </div>
                         </a>
                       ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <a href="/quote" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
               Get Quote
             </a>
             <a href="/features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
               Features
             </a>
             <a href="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
               Support
             </a>
             
             {/* Action Buttons */}
             <div className="flex items-center space-x-3">
               <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                 <Search className="h-5 w-5" />
               </button>
               <a href="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-50">
                 <User className="w-4 h-4" />
                 <span>Admin</span>
               </a>
               <DynamicPhoneNumber
                 defaultNumber="(555) 123-4567"
                 className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
               >
                 <Phone className="h-4 w-4" />
                 <span>Call Now</span>
               </DynamicPhoneNumber>
             </div>
           </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-4">
                <a href="/" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Home
                </a>
                
                {/* Mobile Brands Section */}
                <div>
                  <button
                    onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    <span>Our Brands</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isBrandsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2"
                      >
                        {brands.map((brand) => (
                          <a
                            key={brand.path}
                            href={brand.path}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            <div className={`w-3 h-3 rounded-full bg-${brand.color}-500`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{brand.name}</p>
                              <p className="text-sm text-gray-500">{brand.state}</p>
                            </div>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a href="/quote" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Get Quote
                </a>
                <a href="/admin" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </a>
                <a href="/features" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Features
                </a>
                <a href="/contact" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Support
                </a>
                
                {/* Mobile CTA */}
                <DynamicPhoneNumber
                  defaultNumber="(555) 123-4567"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </DynamicPhoneNumber>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
} 