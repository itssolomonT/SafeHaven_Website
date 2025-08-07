'use client'

import { ReactNode, useState, useEffect } from 'react'
import Navigation from './Navigation'
import AIChatWidget from './AIChatWidget' // Chat widget for lead capture
import WeatherDisplay from './WeatherDisplay'
import ParticleNetwork from './ParticleNetwork' // Particle network effect
import GlowingGrid from './GlowingGrid' // Glowing animated grid

interface LayoutProps {
  children: ReactNode
  zipCode?: string
  brand?: any
}

export default function Layout({ children, zipCode = '', brand }: LayoutProps) {
  // Track if component is mounted for client-side rendering
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      <ParticleNetwork />
      <GlowingGrid />
      {mounted && <Navigation />}
      
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">SafeHaven Security Systems</h3>
              <p className="text-gray-400 mb-4">
                Protecting families across the Southeast with reliable security solutions.
              </p>
              <div className="flex space-x-4">
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                <a href="/quote" className="text-gray-400 hover:text-white transition-colors">Get Quote</a>
                <a href="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</a>
              </div>
            </div>

            {/* Our Brands */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Brands</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="/brands/safehaven-nc" className="block hover:text-white transition-colors">SafeHaven NC</a>
                <a href="/brands/safehaven-sc" className="block hover:text-white transition-colors">SafeHaven SC</a>
                <a href="/brands/safehaven-tn" className="block hover:text-white transition-colors">SafeHaven TN</a>
                <a href="/brands/topsecurity" className="block hover:text-white transition-colors">TopSecurity GA</a>
                <a href="/brands/bestsecurity" className="block hover:text-white transition-colors">BestSecurity FL</a>
                <a href="/brands/redhawk-alarms" className="block hover:text-white transition-colors">RedHawk Alarms AL</a>
              </div>
            </div>

            {/* Legal & Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal & Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="block hover:text-white transition-colors">Terms of Service</a>
                <a href="/cookies" className="block hover:text-white transition-colors">Cookie Policy</a>
                <div className="pt-2">
                  <p>(555) 123-4567</p>
                  <p>info@safehaven.com</p>
                  <p className="text-xs text-gray-500 mt-1">NC, SC, GA, FL, AL, TN</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 SafeHaven Security Systems. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2 md:mt-0">
                Professional security solutions across the Southeast
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Weather widget - shows local weather */}
      {mounted && (
        <div className="fixed top-20 right-4 z-40">
          <WeatherDisplay zipCode={zipCode} className="w-64" />
        </div>
      )}

      {/* Chat widget for lead capture */}
      {mounted && (
        <AIChatWidget
          brand={brand ? {
            name: brand.name,
            displayName: brand.displayName,
            phoneNumber: brand.phoneNumber
          } : undefined}
          onLeadCapture={(data) => {
            console.log('Lead captured from chat:', data)
          }}
        />
      )}
    </div>
  )
} 