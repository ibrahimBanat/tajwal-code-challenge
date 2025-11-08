import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useRepositorySearch, useUserSearch, useGitHubSearch } from '../use-github-search'
import { githubApi } from '@/lib/github-api'

jest.mock('@/lib/github-api')
jest.mock('../use-debounce', () => ({
  useDebounce: (value: string) => value, // Mock debounce to return immediately
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useRepositorySearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch repositories successfully', async () => {
    const mockData = {
      total_count: 2,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: 'repo1',
          full_name: 'user/repo1',
          owner: { login: 'user', avatar_url: '', html_url: '' },
          html_url: '',
          description: 'Test repo',
          stargazers_count: 100,
          language: 'TypeScript',
        },
      ],
    }

    ;(githubApi.searchRepositories as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useRepositorySearch('react', {}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.pages[0]).toEqual(mockData)
    expect(githubApi.searchRepositories).toHaveBeenCalledWith({
      query: 'react',
      page: 1,
      per_page: 30,
    })
  })

  it('should not fetch when query is empty', () => {
    const { result } = renderHook(() => useRepositorySearch('', {}), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(githubApi.searchRepositories).not.toHaveBeenCalled()
  })

  it('should handle filters', async () => {
    const mockData = {
      total_count: 1,
      incomplete_results: false,
      items: [],
    }

    ;(githubApi.searchRepositories as jest.Mock).mockResolvedValue(mockData)

    const filters = { sort: 'stars', order: 'desc' as const, language: 'javascript' }

    const { result } = renderHook(() => useRepositorySearch('test', filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(githubApi.searchRepositories).toHaveBeenCalledWith({
      query: 'test',
      page: 1,
      per_page: 30,
      sort: 'stars',
      order: 'desc',
      language: 'javascript',
    })
  })

  it('should handle pagination', async () => {
    const mockData = {
      total_count: 100,
      incomplete_results: false,
      items: new Array(30).fill({
        id: 1,
        name: 'repo',
        full_name: 'user/repo',
        owner: { login: 'user', avatar_url: '', html_url: '' },
        html_url: '',
        description: '',
        stargazers_count: 0,
        language: 'TypeScript',
      }),
    }

    ;(githubApi.searchRepositories as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useRepositorySearch('test', {}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.hasNextPage).toBe(true)

    await result.current.fetchNextPage()

    await waitFor(() => expect(result.current.data?.pages.length).toBe(2))

    expect(githubApi.searchRepositories).toHaveBeenCalledTimes(2)
    expect(githubApi.searchRepositories).toHaveBeenLastCalledWith({
      query: 'test',
      page: 2,
      per_page: 30,
    })
  })

  it('should handle errors', async () => {
    const mockError = new Error('API Error')
    ;(githubApi.searchRepositories as jest.Mock).mockRejectedValue(mockError)

    const { result } = renderHook(() => useRepositorySearch('test', {}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toEqual(mockError)
  })
})

describe('useUserSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch users successfully', async () => {
    const mockData = {
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          login: 'testuser',
          avatar_url: '',
          html_url: '',
          type: 'User',
        },
      ],
    }

    ;(githubApi.searchUsers as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useUserSearch('testuser', {}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.pages[0]).toEqual(mockData)
    expect(githubApi.searchUsers).toHaveBeenCalledWith({
      query: 'testuser',
      page: 1,
      per_page: 30,
    })
  })

  it('should not fetch when query is empty', () => {
    const { result } = renderHook(() => useUserSearch('', {}), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(githubApi.searchUsers).not.toHaveBeenCalled()
  })
})

describe('useGitHubSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should search repositories when type is repositories', async () => {
    const mockData = {
      total_count: 1,
      incomplete_results: false,
      items: [],
    }

    ;(githubApi.searchRepositories as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(
      () => useGitHubSearch('test', 'repositories', {}),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.type).toBe('repositories')
    expect(githubApi.searchRepositories).toHaveBeenCalled()
    expect(githubApi.searchUsers).not.toHaveBeenCalled()
  })

  it('should search users when type is users', async () => {
    const mockData = {
      total_count: 1,
      incomplete_results: false,
      items: [],
    }

    ;(githubApi.searchUsers as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useGitHubSearch('test', 'users', {}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.type).toBe('users')
    expect(githubApi.searchUsers).toHaveBeenCalled()
    expect(githubApi.searchRepositories).not.toHaveBeenCalled()
  })
})