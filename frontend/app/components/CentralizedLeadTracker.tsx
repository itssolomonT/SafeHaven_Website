'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { useMultiBrand } from './MultiBrandProvider'

interface LeadData {
  id: string
  brandId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  address?: string
  source: string
  utmParams: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
  sessionId: string
  conversionType: 'form_submit' | 'phone_call' | 'chat' | 'quote_request'
  deviceType: 'mobile' | 'desktop' | 'tablet'
  pageUrl: string
  timeOnPage: number
  scrollDepth: number
  previousVisits: number
  callSource?: string
  salesTeam?: string
  leadPriority?: 'high' | 'medium' | 'low'
  expectedCloseTime?: Date
  marketSegment?: string
  brandSpecificData?: Record<string, any>
}

interface LeadTrackerContextType {
  currentLead: LeadData | null
  startSession: () => Promise<string>
  trackPageView: (pageUrl: string) => void
  trackFormSubmission: (formData: Partial<LeadData>) => Promise<void>
  trackPhoneCall: (phoneNumber: string) => void
  trackChatInteraction: (message: string) => void
  getLeadScore: (leadData: Partial<LeadData>) => number
  getRecommendedNextSteps: (leadData: Partial<LeadData>) => string[]
}

const LeadTrackerContext = createContext<LeadTrackerContextType | null>(null)

interface LeadTrackerProviderProps {
  children: ReactNode
}

export function LeadTrackerProvider({ children }: LeadTrackerProviderProps) {
  const [currentLead, setCurrentLead] = useState<LeadData | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const { currentBrand, sharedModules } = useMultiBrand()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Start session and get session ID
  const startSession = useCallback(async (): Promise<string> => {
    if (!mounted) return `session_${Date.now()}`
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: currentBrand?.id || 'default',
          zipCode: '',
          userAgent: navigator.userAgent,
          ipAddress: '', // Will be set by backend
          referrer: document.referrer,
          utmParams: sharedModules.tracking.utmTracking({}),
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          screenResolution: `${screen.width}x${screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      })
      
      const data = await response.json()
      const newSessionId = data.data.id
      setSessionId(newSessionId)
      return newSessionId
    } catch (error) {
      console.error('Error starting session:', error)
      const fallbackSessionId = `session_${Date.now()}`
      setSessionId(fallbackSessionId)
      return fallbackSessionId
    }
  }, [mounted, currentBrand?.id, sharedModules.tracking])

  // Track page view
  const trackPageView = (pageUrl: string) => {
    if (mounted && typeof window !== 'undefined') {
      // Track in GA4
      sharedModules.tracking.gtag('page_view', {
        page_title: document.title,
        page_location: pageUrl,
        brand_id: currentBrand?.id
      })

      // Track in dataLayer
      sharedModules.tracking.dataLayer({
        event: 'page_view',
        page_url: pageUrl,
        brand_id: currentBrand?.id,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Track form submission
  const trackFormSubmission = async (formData: Partial<LeadData>) => {
    if (!mounted) return
    
    try {
      const leadData: LeadData = {
        id: `lead_${Date.now()}`,
        brandId: currentBrand?.id || 'default',
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        zipCode: formData.zipCode || '',
        address: formData.address,
        source: formData.source || 'website',
        utmParams: sharedModules.tracking.utmTracking({}),
        sessionId: sessionId || await startSession(),
        conversionType: 'form_submit',
        deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        pageUrl: window.location.href,
        timeOnPage: Math.floor((Date.now() - (window as any).pageLoadTime) / 1000),
        scrollDepth: (window as any).maxScrollDepth || 0,
        previousVisits: parseInt(localStorage.getItem('visitCount') || '0'),
        callSource: 'online',
        salesTeam: 'national_call_center',
        leadPriority: getLeadPriority(formData),
        expectedCloseTime: calculateExpectedCloseTime(formData),
        marketSegment: getMarketSegment(formData.zipCode),
        brandSpecificData: {
          brandName: currentBrand?.displayName,
          brandDomain: currentBrand?.domain
        }
      }

      // Submit to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })

      if (response.ok) {
        setCurrentLead(leadData)
        
        // Track conversion
        sharedModules.tracking.gtag('conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
          value: 1.0,
          currency: 'USD',
          transaction_id: leadData.id
        })

        // Store in localStorage for return visitor tracking
        localStorage.setItem('lastLeadEmail', leadData.email)
        localStorage.setItem('lastLeadPhone', leadData.phone)
        
        console.log('Lead tracked successfully:', leadData)
      }
    } catch (error) {
      console.error('Error tracking form submission:', error)
    }
  }

  // Track phone call
  const trackPhoneCall = (phoneNumber: string) => {
    if (!mounted) return
    
    const callData = {
      event: 'phone_call',
      phone_number: phoneNumber,
      brand_id: currentBrand?.id,
      source: sharedModules.tracking.utmTracking({}).utm_source || 'direct',
      timestamp: new Date().toISOString()
    }

    sharedModules.tracking.gtag('event', {
  event_category: 'lead',
  event_label: 'phone_call',
  ...callData
});
    sharedModules.tracking.dataLayer(callData)
  }

  // Track chat interaction
  const trackChatInteraction = (message: string) => {
    if (!mounted) return
    
    const chatData = {
      event: 'chat_interaction',
      message: message,
      brand_id: currentBrand?.id,
      timestamp: new Date().toISOString()
    }

    sharedModules.tracking.dataLayer(chatData)
  }

  // Calculate lead score
  const getLeadScore = (leadData: Partial<LeadData>): number => {
    let score = 0
    
    // Source scoring
    const sourceScores: Record<string, number> = {
      'organic_search': 10,
      'paid_search': 15,
      'social_media': 12,
      'direct': 8,
      'referral': 14,
      'email': 16
    }
    score += sourceScores[leadData.source || 'direct'] || 5

    // Device scoring
    if (leadData.deviceType === 'mobile') score += 5
    if (leadData.deviceType === 'desktop') score += 3

    // Engagement scoring
    if ((leadData.timeOnPage || 0) > 300) score += 10
    if ((leadData.scrollDepth || 0) > 75) score += 8
    if ((leadData.previousVisits || 0) > 0) score += 15

    // UTM parameter scoring
    const utmParams = leadData.utmParams || {}
    if (utmParams.utm_campaign?.includes('high-intent')) score += 20
    if (utmParams.utm_term?.includes('quote')) score += 15

    return Math.min(score, 100)
  }

  // Get lead priority
  const getLeadPriority = (leadData: Partial<LeadData>): 'high' | 'medium' | 'low' => {
    const score = getLeadScore(leadData)
    if (score >= 70) return 'high'
    if (score >= 40) return 'medium'
    return 'low'
  }

  // Calculate expected close time
  const calculateExpectedCloseTime = (leadData: Partial<LeadData>): Date => {
    const baseTime = 1.7 * 24 * 60 * 60 * 1000 // 1.7 days in milliseconds
    const sourceMultipliers: Record<string, number> = {
      'paid_search': 0.8,
      'organic_search': 1.0,
      'social_media': 1.2,
      'direct': 0.9,
      'referral': 0.7,
      'email': 0.6
    }
    const multiplier = sourceMultipliers[leadData.source || 'direct'] || 1.0
    return new Date(Date.now() + (baseTime * multiplier))
  }

  // Get market segment
  const getMarketSegment = (zipCode?: string): string => {
    if (!zipCode) return 'unknown'
    
    const zipPrefix = zipCode.substring(0, 3)
    const segments: Record<string, string> = {
      '270': 'premium_urban',
      '290': 'suburban_family',
      '300': 'premium_urban',
      '320': 'rural_community'
    }
    
    return segments[zipPrefix] || 'standard_market'
  }

  // Get recommended next steps
  const getRecommendedNextSteps = (leadData: Partial<LeadData>): string[] => {
    const steps = []
    
    if (leadData.conversionType === 'form_submit') {
      steps.push('Send welcome email within 5 minutes')
      steps.push('Assign to sales team within 15 minutes')
      steps.push('Schedule follow-up call within 24 hours')
    }
    
    if (leadData.conversionType === 'phone_call') {
      steps.push('Log call details in CRM')
      steps.push('Send quote within 1 hour')
      steps.push('Schedule installation consultation')
    }
    
    if (leadData.conversionType === 'chat') {
      steps.push('Follow up with chat transcript')
      steps.push('Send personalized quote')
      steps.push('Schedule demo call')
    }
    
    return steps
  }

  // Initialize session on mount
  useEffect(() => {
    if (!mounted) return
    
    const initSession = async () => {
      await startSession()
    }
    
    initSession()
    ;(window as any).pageLoadTime = Date.now()
    ;(window as any).maxScrollDepth = 0
    
    // Increment visit count for return visitor tracking
    const currentVisitCount = parseInt(localStorage.getItem('visitCount') || '0')
    localStorage.setItem('visitCount', (currentVisitCount + 1).toString())
    
    // Track scroll depth
    const trackScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      ;(window as any).maxScrollDepth = Math.max((window as any).maxScrollDepth || 0, scrollPercent)
    }
    
    window.addEventListener('scroll', trackScroll)
    
    return () => window.removeEventListener('scroll', trackScroll)
  }, [mounted, startSession])

  const value: LeadTrackerContextType = {
    currentLead,
    startSession,
    trackPageView,
    trackFormSubmission,
    trackPhoneCall,
    trackChatInteraction,
    getLeadScore,
    getRecommendedNextSteps
  }

  return (
    <LeadTrackerContext.Provider value={value}>
      {children}
    </LeadTrackerContext.Provider>
  )
}

export function useLeadTracker() {
  const context = useContext(LeadTrackerContext)
  if (!context) {
    throw new Error('useLeadTracker must be used within a LeadTrackerProvider')
  }
  return context
} 
