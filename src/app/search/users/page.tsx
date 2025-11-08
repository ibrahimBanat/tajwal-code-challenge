"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AppHeader } from "@/components/layout/AppHeader"
import { SearchFilters } from "@/components/search/SearchFilters"
import { UserResults } from "@/components/search/UserResults"
import { BackToTopButton } from "@/components/ui/BackToTopButton"
import { env } from "@/lib/env"

interface GitHubUser {
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

function UsersSearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [filters, setFilters] = useState<any>({})

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorMsg,
    fetchNextPage: userFetchNext,
    hasNextPage: userHasNext,
    isFetchingNextPage: userFetching,
  } = useInfiniteQuery({
    queryKey: ['users', query, filters],
    queryFn: async ({ pageParam = 1 }) => {
      if (!query) return { items: [], total_count: 0 }
      
      // Build search query for users
      let searchQuery = query.trim()
      
      // Users API supports different qualifiers like type:user, location:, etc.
      // For now, keep it simple but properly structured
      
      // Convert sort value to GitHub API format
      let apiSort = filters.sort || 'best-match'
      let apiOrder = 'desc'
      
      if (filters.sort === 'followers-asc') {
        apiSort = 'followers'
        apiOrder = 'asc'
      } else if (filters.sort === 'repositories-asc') {
        apiSort = 'repositories'
        apiOrder = 'asc'
      }
      
      const searchParams = new URLSearchParams({
        q: searchQuery,
        sort: apiSort,
        order: apiOrder,
        per_page: '30',
        page: pageParam.toString(),
      })

      const response = await fetch(`${env.github.apiBaseUrl}/search/users?${searchParams.toString()}`)
      
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

  const users = userData?.pages.flatMap(page => page.items) || []
  const totalCount = userData?.pages[0]?.total_count || 0

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {query && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
              <h1 className="text-2xl font-bold break-words">
                User search results for "{query}"
              </h1>
              
              <SearchFilters
                searchType="users"
                onFiltersChange={setFilters}
              />
            </div>

            <UserResults
              users={users}
              isLoading={userLoading}
              isError={userError}
              error={userErrorMsg as Error}
              hasNextPage={userHasNext}
              fetchNextPage={userFetchNext}
              isFetchingNextPage={userFetching}
              totalCount={totalCount}
            />
          </>
        )}

        {!query && (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">
              Use the search bar above to find users
            </h2>
          </div>
        )}
      </main>
      
      <BackToTopButton />
    </div>
  )
}

export default function UsersSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><AppHeader /><div className="container mx-auto px-4 py-8 text-center">Loading...</div></div>}>
      <UsersSearchContent />
    </Suspense>
  )
}