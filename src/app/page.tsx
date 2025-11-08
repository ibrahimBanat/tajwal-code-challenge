"use client"

import { Search } from "lucide-react"
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from "@/ui"

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AppHeader />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            GitHub Search
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Search through millions of repositories and discover amazing developers. 
            Find the perfect projects and libraries for your next idea.
          </p>
        </div>
      </main>
    </div>
  )
}