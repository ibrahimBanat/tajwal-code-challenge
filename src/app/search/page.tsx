"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'repositories'

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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  )
}