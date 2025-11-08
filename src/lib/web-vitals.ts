import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

interface AnalyticsEvent {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

function sendToAnalytics(metric: Metric) {
  const body: AnalyticsEvent = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', body)
  }

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    if (navigator.sendBeacon) {
      const url = '/api/analytics'
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
    }
  }
}

export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
    onINP(sendToAnalytics)
  } catch (error) {
    console.error('Error reporting web vitals:', error)
  }
}

export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  return {
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    request: navigation?.responseStart - navigation?.requestStart,
    response: navigation?.responseEnd - navigation?.responseStart,
    dom: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    load: navigation?.loadEventEnd - navigation?.loadEventStart,
    total: navigation?.loadEventEnd - navigation?.fetchStart,
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime,
    resources: performance.getEntriesByType('resource').length,
  }
}

export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name)
  }
}

export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name, 'measure')[0]

      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️  ${name}: ${measure.duration.toFixed(2)}ms`)
      }

      return measure.duration
    } catch (error) {
      console.error('Error measuring performance:', error)
      return null
    }
  }
  return null
}

export function clearPerformance() {
  if (typeof window !== 'undefined' && window.performance) {
    performance.clearMarks()
    performance.clearMeasures()
  }
}

export function exportAllMetrics() {
  return {
    performance: getPerformanceMetrics(),
    marks: performance.getEntriesByType('mark'),
    measures: performance.getEntriesByType('measure'),
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
