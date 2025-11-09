"use client"

import { useEffect, useRef } from "react"
import { MapPin, Users, Building, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui"
import { If } from "@/components/common"

interface User {
  id: number
  login: string
  name?: string
  bio?: string
  avatar_url: string
  html_url: string
  company?: string
  location?: string
  followers: number
  following: number
  public_repos: number
  type?: string
}

interface UserResultsProps {
  users: User[]
  isLoading: boolean
  isError: boolean
  error?: Error
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  totalCount?: number
}

export function UserResults({ 
  users, 
  isLoading, 
  isError, 
  error, 
  hasNextPage, 
  fetchNextPage, 
  isFetchingNextPage,
  totalCount 
}: UserResultsProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !fetchNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          // Add small delay to prevent rapid calls
          setTimeout(() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }, 100)
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px"
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex items-center gap-2 text-red-600 p-6">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading users: {error?.message || 'Unknown error'}</p>
        </CardContent>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <If condition={!!totalCount}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Users ({totalCount?.toLocaleString()})
          </h2>
        </div>
      </If>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardTitle>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {user.login}
                </a>
              </CardTitle>

              <If condition={!!user.name}>
                <CardDescription>
                  {user.name}
                </CardDescription>
              </If>
            </CardHeader>

            <CardContent className="space-y-3">
              <If condition={!!user.bio}>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {user.bio}
                </p>
              </If>
            </CardContent>
          </Card>
        ))}
      </div>

      <If condition={!!hasNextPage}>
        <div ref={loadMoreRef} className="py-4 min-h-[40px]">
          <If condition={!!isFetchingNextPage}>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                Loading more users...
              </div>
            </div>
          </If>
        </div>
      </If>
    </div>
  )
}