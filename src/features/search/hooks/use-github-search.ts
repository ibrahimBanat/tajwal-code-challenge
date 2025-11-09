import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { githubApi } from '@/lib/github-api'
import { env } from '@/lib/env'
import type {
  SearchParams,
  GitHubRepository,
  GitHubUser,
  SearchType,
  GitHubFork,
} from '@/types/github'

interface SearchFilters {
  sort?: string
  order?: 'asc' | 'desc'
  language?: string
  [key: string]: string | undefined
}

export function useRepositorySearch(query: string, filters: SearchFilters = {}, enabled: boolean = true) {
  const debouncedQuery = useDebounce(query, env.search.debounceDelay)

  return useInfiniteQuery({
    queryKey: ['repositories', debouncedQuery, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams: SearchParams = {
        query: debouncedQuery,
        page: pageParam,
        per_page: 30,
        ...filters,
      }
      return githubApi.searchRepositories(searchParams)
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total_count
      const currentItems = allPages.reduce((sum, page) => sum + page.items.length, 0)
      
      return currentItems < totalItems ? allPages.length + 1 : undefined
    },
    enabled: enabled && debouncedQuery.trim().length > 0,
    staleTime: env.query.staleTime,
    initialPageParam: 1,
  })
}

export function useUserSearch(query: string, filters: SearchFilters = {}, enabled: boolean = true) {
  const debouncedQuery = useDebounce(query, env.search.debounceDelay)

  return useInfiniteQuery({
    queryKey: ['users', debouncedQuery, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams: SearchParams = {
        query: debouncedQuery,
        page: pageParam,
        per_page: 30,
        ...filters,
      }
      return githubApi.searchUsers(searchParams)
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total_count
      const currentItems = allPages.reduce((sum, page) => sum + page.items.length, 0)
      
      return currentItems < totalItems ? allPages.length + 1 : undefined
    },
    enabled: enabled && debouncedQuery.trim().length > 0,
    staleTime: env.query.staleTime,
    initialPageParam: 1,
  })
}

export function useRepositoryDetails(owner: string, repo: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['repository-details', owner, repo],
    queryFn: async (): Promise<{
      fileTypes: string[]
      recentForks: GitHubFork[]
    }> => {
      const [fileTypes, recentForks] = await Promise.all([
        githubApi.extractFileTypes(owner, repo),
        githubApi.getRepositoryForks(owner, repo, 3),
      ])

      return {
        fileTypes,
        recentForks,
      }
    },
    enabled: enabled && Boolean(owner && repo),
    staleTime: env.repositoryDetails.staleTime,
    retry: env.repositoryDetails.retryCount,
  })
}

export function useGitHubSearch(query: string, searchType: SearchType, filters: SearchFilters = {}) {
  const repositorySearch = useRepositorySearch(
    query,
    filters,
    searchType === 'repositories'
  )
  
  const userSearch = useUserSearch(
    query,
    filters,
    searchType === 'users'
  )

  if (searchType === 'repositories') {
    return {
      ...repositorySearch,
      data: repositorySearch.data,
      type: 'repositories' as const,
    }
  }

  return {
    ...userSearch,
    data: userSearch.data,
    type: 'users' as const,
  }
}

export function useProcessedRepositories(repositories: GitHubRepository[]) {
  const repositoryQueries = repositories.map(repo => 
    useRepositoryDetails(repo.owner.login, repo.name)
  )

  return repositories.map((repo, index) => {
    const details = repositoryQueries[index]
    
    return {
      ...repo,
      fileTypes: details.data?.fileTypes || [],
      recentForks: details.data?.recentForks || [],
      isLoadingDetails: details.isLoading,
    }
  })
}