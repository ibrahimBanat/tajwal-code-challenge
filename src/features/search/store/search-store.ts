import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SearchType } from '@/types/github'

interface SearchFilters {
  sort?: string
  order?: 'asc' | 'desc'
  language?: string
  [key: string]: string | undefined
}

interface SearchState {
  query: string
  searchType: SearchType
  isSearchFocused: boolean
  filters: SearchFilters
  setQuery: (query: string) => void
  setSearchType: (type: SearchType) => void
  setIsSearchFocused: (focused: boolean) => void
  setFilters: (filters: SearchFilters) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>()(
  devtools(
    (set, get) => ({
      query: '',
      searchType: 'repositories',
      isSearchFocused: false,
      filters: {},

      setQuery: (query) => {
        set({ query }, false, 'setQuery')
      },

      setSearchType: (searchType) => {
        set({ searchType }, false, 'setSearchType')
      },

      setIsSearchFocused: (isSearchFocused) => {
        set({ isSearchFocused }, false, 'setIsSearchFocused')
      },

      setFilters: (filters) => {
        set({ filters }, false, 'setFilters')
      },

      clearSearch: () => {
        set({ query: '', isSearchFocused: false, filters: {} }, false, 'clearSearch')
      },
    }),
    {
      name: 'search-store',
      enabled: process.env.NODE_ENV === 'development' && typeof window !== 'undefined',
    }
  )
)

export const useQuery = () => useSearchStore((state) => state.query)
export const useSearchType = () => useSearchStore((state) => state.searchType)
export const useIsSearchFocused = () => useSearchStore((state) => state.isSearchFocused)

export const useSearchActions = () => useSearchStore((state) => ({
  setQuery: state.setQuery,
  setSearchType: state.setSearchType,
  setIsSearchFocused: state.setIsSearchFocused,
  clearSearch: state.clearSearch,
}))