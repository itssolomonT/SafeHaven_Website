'use client'

import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'

interface DynamicPhoneNumberProps {
  defaultNumber: string
  className?: string
  children?: React.ReactNode
}

const phoneNumberMapping = {
  'google': '800-111-2222',
  'valpak': '800-333-4444',
  'facebook': '800-444-5555',
  'instagram': '800-555-6666',
  'bing': '800-666-7777',
  'yahoo': '800-777-8888',
  'direct': '800-888-9999',
  'organic': '800-999-0000'
}

export default function DynamicPhoneNumber({ defaultNumber, className = '', children }: DynamicPhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState(defaultNumber)
  const [source, setSource] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Get source from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const sourceParam = urlParams.get('source')?.toLowerCase()
    
    if (sourceParam && phoneNumberMapping[sourceParam as keyof typeof phoneNumberMapping]) {
      setPhoneNumber(phoneNumberMapping[sourceParam as keyof typeof phoneNumberMapping])
      setSource(sourceParam)
    } else {
      setPhoneNumber(defaultNumber)
      setSource('default')
    }
  }, [defaultNumber, mounted])

  const handleClick = () => {
    // Track phone call event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'phone_call', {
        event_category: 'conversion',
        event_label: source,
        value: 1
      })
    }

    // Track in dataLayer for GA4/Segment
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'phone_call',
        source: source,
        phone_number: phoneNumber,
        timestamp: new Date().toISOString()
      })
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <a
        href={`tel:${defaultNumber}`}
        className={`inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors ${className}`}
      >
        {children ? (
          children
        ) : (
          <>
            <Phone className="w-4 h-4" />
            <span>{defaultNumber}</span>
          </>
        )}
      </a>
    )
  }

  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors ${className}`}
    >
      {children ? (
        children
      ) : (
        <>
          <Phone className="w-4 h-4" />
          <span>{phoneNumber}</span>
          {source && source !== 'default' && (
            <span className="text-xs text-gray-500">({source})</span>
          )}
        </>
      )}
    </a>
  )
} 