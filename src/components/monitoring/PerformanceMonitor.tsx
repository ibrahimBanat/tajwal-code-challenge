'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export function PerformanceMonitor() {
  useEffect(() => {
    reportWebVitals()

    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          if (window.performance) {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

            console.log('🚀 Performance Metrics:', {
              'DNS Lookup': `${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`,
              'TCP Connection': `${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`,
              'Request': `${(navigation.responseStart - navigation.requestStart).toFixed(2)}ms`,
              'Response': `${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`,
              'DOM Processing': `${(navigation.domComplete - navigation.domInteractive).toFixed(2)}ms`,
              'Total Load Time': `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`,
            })

            const resources = performance.getEntriesByType('resource')
            console.log(`📦 Resources Loaded: ${resources.length}`)

            const slowResources = resources
              .filter((resource: any) => resource.duration > 1000)
              .map((resource: any) => ({
                name: resource.name.split('/').pop(),
                duration: `${resource.duration.toFixed(2)}ms`,
              }))

            if (slowResources.length > 0) {
              console.warn('⚠️ Slow Resources (>1s):', slowResources)
            }
          }
        }, 0)
      })
    }
  }, [])

  return null
}
