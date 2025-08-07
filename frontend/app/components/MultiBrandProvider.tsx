'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Brand configuration interface
interface BrandConfig {
  id: string
  name: string
  displayName: string
  domain: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  phoneNumber: string
  ctaText: string
  ctaColor: string
  logo: string
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
  states: string[]
  zipCodes: string[]
  isActive: boolean
}

// Shared modules interface
interface SharedModules {
  formLogic: {
    fields: string[]
    validation: Record<string, any>
    submission: (data: any) => Promise<any>
  }
  tracking: {
    gtag: (event: string, params: any) => void
    dataLayer: (data: any) => void
    utmTracking: (params: any) => any
  }
  ctaComponents: {
    primary: ReactNode
    secondary: ReactNode
    phone: ReactNode
  }
}

// Multi-brand context
interface MultiBrandContextType {
  currentBrand: BrandConfig | null
  sharedModules: SharedModules
  updateBrand: (brandId: string) => void
  getBrandByDomain: (domain: string) => BrandConfig | null
  getBrandByZipCode: (zipCode: string) => BrandConfig | null
}

const MultiBrandContext = createContext<MultiBrandContextType | null>(null)

// Brand configurations
const brandConfigs: Record<string, BrandConfig> = {
  'safehaven-nc': {
    id: 'safehaven-nc',
    name: 'safehaven-nc',
    displayName: 'SafeHaven NC',
    domain: 'safehaven-nc.com',
    colors: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#3b82f6',
      background: '#f8fafc'
    },
    phoneNumber: '(919) 555-0123',
    ctaText: 'Get NC Security Quote',
    ctaColor: 'bg-blue-600 hover:bg-blue-700',
    logo: '/logos/safehaven-nc.png',
    description: 'Professional security solutions for North Carolina',
    features: ['Local NC Team', '15+ Years Experience', '24/7 Monitoring'],
    testimonials: [
      {
        id: '1',
        rating: 5,
        text: 'Excellent service and professional installation.',
        name: 'Sarah Johnson',
        location: 'Raleigh, NC',
        date: '2024-01-15'
      }
    ],
    states: ['NC'],
    zipCodes: ['27000', '27001', '27002', '27003'],
    isActive: true
  },
  'safehaven-sc': {
    id: 'safehaven-sc',
    name: 'safehaven-sc',
    displayName: 'SafeHaven SC',
    domain: 'safehaven-sc.com',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#f0fdf4'
    },
    phoneNumber: '(803) 555-0123',
    ctaText: 'Get SC Security Quote',
    ctaColor: 'bg-green-600 hover:bg-green-700',
    logo: '/logos/safehaven-sc.png',
    description: 'Advanced security solutions for South Carolina',
    features: ['Advanced Detection', 'HD Video', 'Professional Service'],
    testimonials: [
      {
        id: '2',
        rating: 5,
        text: 'Best security system we\'ve ever had.',
        name: 'Mike Davis',
        location: 'Columbia, SC',
        date: '2024-01-20'
      }
    ],
    states: ['SC'],
    zipCodes: ['29000', '29001', '29002', '29003'],
    isActive: true
  },
  'topsecurity': {
    id: 'topsecurity',
    name: 'topsecurity',
    displayName: 'TopSecurity GA',
    domain: 'topsecurity-ga.com',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ef4444',
      background: '#fef2f2'
    },
    phoneNumber: '(404) 555-0123',
    ctaText: 'Get GA Security Quote',
    ctaColor: 'bg-red-600 hover:bg-red-700',
    logo: '/logos/topsecurity.png',
    description: 'Premium security solutions for Georgia',
    features: ['AI-Powered', 'Cloud Storage', 'Smart Alerts'],
    testimonials: [
      {
        id: '3',
        rating: 5,
        text: 'Cutting-edge technology and great service.',
        name: 'Lisa Chen',
        location: 'Atlanta, GA',
        date: '2024-01-25'
      }
    ],
    states: ['GA'],
    zipCodes: ['30000', '30001', '30002', '30003'],
    isActive: true
  }
}

interface MultiBrandProviderProps {
  children: ReactNode
}

export function MultiBrandProvider({ children }: MultiBrandProviderProps) {
  // Current brand and mounted state
  const [currentBrand, setCurrentBrand] = useState<BrandConfig | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-detect brand from pathname
  useEffect(() => {
    const pathSegments = pathname.split('/')
    const brandSegment = pathSegments[1] === 'brands' ? pathSegments[2] : null
    
    if (brandSegment && brandConfigs[brandSegment]) {
      setCurrentBrand(brandConfigs[brandSegment])
    } else {
      // Default to SafeHaven NC
      setCurrentBrand(brandConfigs['safehaven-nc'])
    }
  }, [pathname])

  const updateBrand = (brandId: string) => {
    if (brandConfigs[brandId]) {
      setCurrentBrand(brandConfigs[brandId])
      router.push(`/brands/${brandId}`)
    }
  }

  const getBrandByDomain = (domain: string): BrandConfig | null => {
    return Object.values(brandConfigs).find(brand => brand.domain === domain) || null
  }

  const getBrandByZipCode = (zipCode: string): BrandConfig | null => {
    return Object.values(brandConfigs).find(brand => 
      brand.zipCodes.some(zip => zipCode.startsWith(zip.substring(0, 3)))
    ) || null
  }

  // Shared modules implementation with client-side only tracking
  const sharedModules: SharedModules = {
    formLogic: {
      fields: ['firstName', 'lastName', 'email', 'phone', 'zipCode', 'address', 'propertyType'],
      validation: {
        firstName: { required: true, minLength: 2 },
        lastName: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        phone: { required: true, pattern: /^[\+]?[1-9][\d]{0,15}$/ },
        zipCode: { required: true, pattern: /^\d{5}$/ }
      },
      submission: async (data: any) => {
        // Centralized form submission logic
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json()
      }
    },
    tracking: {
      gtag: (event: string, params: any) => {
        if (mounted && typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', event, params)
        }
      },
      dataLayer: (data: any) => {
        if (mounted && typeof window !== 'undefined' && (window as any).dataLayer) {
          (window as any).dataLayer.push(data)
        }
      },
      utmTracking: (params: any) => {
        if (!mounted || typeof window === 'undefined') {
          return params
        }
        const urlParams = new URLSearchParams(window.location.search)
        return {
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
          utm_term: urlParams.get('utm_term'),
          utm_content: urlParams.get('utm_content'),
          ...params
        }
      }
    },
    ctaComponents: {
      primary: null, // Will be set by each brand
      secondary: null,
      phone: null
    }
  }

  const value: MultiBrandContextType = {
    currentBrand,
    sharedModules,
    updateBrand,
    getBrandByDomain,
    getBrandByZipCode
  }

  return (
    <MultiBrandContext.Provider value={value}>
      {children}
    </MultiBrandContext.Provider>
  )
}

export function useMultiBrand() {
  const context = useContext(MultiBrandContext)
  if (!context) {
    throw new Error('useMultiBrand must be used within a MultiBrandProvider')
  }
  return context
} 