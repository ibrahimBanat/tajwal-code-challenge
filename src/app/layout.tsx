import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/components/providers/query-provider'
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor'
import { PerformanceDashboard } from '@/components/monitoring/PerformanceDashboard'
import { env } from '@/lib/env'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: env.app.name,
  description: 'Search GitHub repositories and users',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PerformanceMonitor />
        <PerformanceDashboard />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}