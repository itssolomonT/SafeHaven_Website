'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BrandRouterProps {
  zipCode: string
}

const brandMapping = {
  '27000': '/brands/safehaven-nc',
  '29000': '/brands/safehaven-sc', 
  '37000': '/brands/safehaven-tn',
  '30000': '/brands/topsecurity',
  '32000': '/brands/bestsecurity',
  '35000': '/brands/redhawk-alarms'
}

export default function BrandRouter({ zipCode }: BrandRouterProps) {
  const router = useRouter()

  useEffect(() => {
    if (zipCode && brandMapping[zipCode as keyof typeof brandMapping]) {
      const brandPath = brandMapping[zipCode as keyof typeof brandMapping]
      router.push(brandPath)
    }
  }, [zipCode, router])

  return null
} 