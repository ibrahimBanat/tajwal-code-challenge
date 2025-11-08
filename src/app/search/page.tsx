"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'repositories'
    
    // Redirect to new URL structure
    if (query) {
      router.replace(`/search/${type}?q=${encodeURIComponent(query)}`)
    } else {
      router.replace('/')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center overflow-x-hidden">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}