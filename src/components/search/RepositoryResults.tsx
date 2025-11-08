"use client"

import { useEffect, useRef } from "react"
import { Star, GitFork, Eye, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/ui"

interface Repository {
  id: number
  full_name: string
  description?: string
  html_url: string
  language?: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  updated_at: string
  topics?: string[]
  fork: boolean
}

interface RepositoryResultsProps {
  repositories: Repository[]
  isLoading: boolean
  isError: boolean
  error?: Error
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  totalCount?: number
}

export function RepositoryResults({ 
  repositories, 
  isLoading, 
  isError, 
  error, 
  hasNextPage, 
  fetchNextPage, 
  isFetchingNextPage,
  totalCount 
}: RepositoryResultsProps) {
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
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
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
          <p>Error loading repositories: {error?.message || 'Unknown error'}</p>
        </CardContent>
      </Card>
    )
  }

  if (repositories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No repositories found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {totalCount && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Repositories ({totalCount.toLocaleString()})
          </h2>
        </div>
      )}

      <div className="space-y-4">
        {repositories.map((repo) => (
          <Card key={repo.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle>
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {repo.full_name}
                    </a>
                  </CardTitle>
                  {repo.description && (
                    <CardDescription className="line-clamp-2">
                      {repo.description}
                    </CardDescription>
                  )}
                </div>
                {repo.fork && (
                  <Badge variant="outline" className="ml-4">
                    <GitFork className="h-3 w-3 mr-1" />
                    Fork
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    {repo.language}
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {repo.stargazers_count.toLocaleString()}
                </div>
                
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  {repo.forks_count.toLocaleString()}
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {repo.watchers_count.toLocaleString()}
                </div>

                {repo.updated_at && (
                  <span className="text-gray-500">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{repo.topics.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-4 min-h-[40px]">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Loading more repositories...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}