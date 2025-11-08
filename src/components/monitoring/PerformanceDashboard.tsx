'use client'

import { useState, useEffect } from 'react'
import { getPerformanceMetrics, exportAllMetrics } from '@/lib/web-vitals'

interface PerformanceMetrics {
  dns: number
  tcp: number
  request: number
  response: number
  dom: number
  load: number
  total: number
  fcp?: number
  resources: number
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Load metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const performanceMetrics = getPerformanceMetrics()
        setMetrics(performanceMetrics)
      }, 100)
    })

    // Listen for keyboard shortcut (Ctrl+Shift+P or Cmd+Shift+P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isOpen || !metrics) {
    return null
  }

  const formatTime = (time?: number) => {
    if (time === undefined || time === null) return 'N/A'
    return `${time.toFixed(2)}ms`
  }

  const getColor = (value: number, threshold: { good: number; poor: number }) => {
    if (value < threshold.good) return 'text-green-600'
    if (value < threshold.poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleExport = () => {
    const allMetrics = exportAllMetrics()
    console.log('📊 Exported Performance Metrics:', allMetrics)

    // Download as JSON
    const blob = new Blob([JSON.stringify(allMetrics, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-metrics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-2xl p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Performance Dashboard</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">DNS Lookup:</span>
          <span className="font-mono font-medium">{formatTime(metrics.dns)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">TCP Connection:</span>
          <span className="font-mono font-medium">{formatTime(metrics.tcp)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Request Time:</span>
          <span className="font-mono font-medium">{formatTime(metrics.request)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Response Time:</span>
          <span className="font-mono font-medium">{formatTime(metrics.response)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">DOM Processing:</span>
          <span className="font-mono font-medium">{formatTime(metrics.dom)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Load Event:</span>
          <span className="font-mono font-medium">{formatTime(metrics.load)}</span>
        </div>

        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-600 font-semibold">Total Load Time:</span>
            <span
              className={`font-mono font-bold ${getColor(metrics.total, { good: 1000, poor: 3000 })}`}
            >
              {formatTime(metrics.total)}
            </span>
          </div>
          {metrics.fcp && (
            <div className="flex justify-between mt-1">
              <span className="text-gray-600 font-semibold">First Contentful Paint:</span>
              <span
                className={`font-mono font-bold ${getColor(metrics.fcp, { good: 1800, poor: 3000 })}`}
              >
                {formatTime(metrics.fcp)}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Resources Loaded:</span>
            <span className="font-mono font-medium">{metrics.resources}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-2">
        Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl+Shift+P</kbd> to toggle
      </div>
    </div>
  )
}
