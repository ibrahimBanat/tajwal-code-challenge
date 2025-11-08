"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AppHeader } from "@/components/layout/AppHeader"
import { SearchFilters } from "@/components/search/SearchFilters"
import { RepositoryResults } from "@/components/search/RepositoryResults"
import { BackToTopButton } from "@/components/ui/BackToTopButton"
import { env } from "@/lib/env"

interface GitHubRepository {
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

function RepositoriesSearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [filters, setFilters] = useState<any>({})

  const {
    data: repoData,
    isLoading: repoLoading,
    isError: repoError,
    error: repoErrorMsg,
    fetchNextPage: repoFetchNext,
    hasNextPage: repoHasNext,
    isFetchingNextPage: repoFetching,
  } = useInfiniteQuery({
    queryKey: ['repositories', query, filters],
    queryFn: async ({ pageParam = 1 }) => {
      if (!query) return { items: [], total_count: 0 }
      
      let searchQuery = query.trim()
      
      let apiSort = filters.sort || 'best-match'
      let apiOrder = 'desc'
      
      if (filters.sort === 'stars-asc') {
        apiSort = 'stars'
        apiOrder = 'asc'
      }
      
      const searchParams = new URLSearchParams({
        q: searchQuery,
        sort: apiSort,
        order: apiOrder,
        per_page: '30',
        page: pageParam.toString(),
      })

      const response = await fetch(`${env.github.apiBaseUrl}/search/repositories?${searchParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `GitHub API error: ${response.status}`)
      }
      
      return response.json()
    },
    enabled: !!query,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // GitHub API limits search results to 1000 total items
      const maxResults = Math.min(lastPage.total_count, 1000)
      const totalPages = Math.ceil(maxResults / 30)
      return allPages.length < totalPages ? allPages.length + 1 : undefined
    },
  })

  const repositories = repoData?.pages.flatMap(page => page.items) || []
  const totalCount = repoData?.pages[0]?.total_count || 0

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {query && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
              <h1 className="text-2xl font-bold break-words">
                Repository search results for "{query}"
              </h1>
              
              <SearchFilters
                searchType="repositories"
                onFiltersChange={setFilters}
              />
            </div>

            <RepositoryResults
              repositories={repositories}
              isLoading={repoLoading}
              isError={repoError}
              error={repoErrorMsg as Error}
              hasNextPage={repoHasNext}
              fetchNextPage={repoFetchNext}
              isFetchingNextPage={repoFetching}
              totalCount={totalCount}
            />
          </>
        )}

        {!query && (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">
              Use the search bar above to find repositories
            </h2>
          </div>
        )}
      </main>
      
      <BackToTopButton />
    </div>
  )
}

export default function RepositoriesSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><AppHeader /><div className="container mx-auto px-4 py-8 text-center">Loading...</div></div>}>
      <RepositoriesSearchContent />
    </Suspense>
  )
}