import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { MultiBrandProvider } from './components/MultiBrandProvider'
import { LeadTrackerProvider } from './components/CentralizedLeadTracker'
import { PerformanceOptimizer } from './components/PerformanceOptimizer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'SafeHaven Security Systems',
  description: 'Professional home security solutions across the Southeast',
  keywords: 'home security, alarm systems, monitoring, safety',
  authors: [{ name: 'SafeHaven Security Systems' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  // Performance optimizations
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero-bg.jpg" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        <link rel="dns-prefetch" href="//api.openweathermap.org" />
      </head>
      <body className={inter.className}>
        <Providers>
          <MultiBrandProvider>
            <LeadTrackerProvider>
              <PerformanceOptimizer>
                {children}
              </PerformanceOptimizer>
            </LeadTrackerProvider>
          </MultiBrandProvider>
        </Providers>
      </body>
    </html>
  )
} 