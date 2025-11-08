"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, GitBranch, User, Clock, X } from "lucide-react"

interface RecentSearch {
  id: string
  query: string
  type: "repositories" | "users"
  timestamp: Date
}

export function AppHeader() {
  const router = useRouter()
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<"repositories" | "users">("repositories")
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("github-recent-searches")
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        }))
        setRecentSearches(parsed)
      } catch (error) {
        console.error("Failed to parse recent searches:", error)
      }
    }
  }, [])

  const saveRecentSearches = (searches: RecentSearch[]) => {
    localStorage.setItem("github-recent-searches", JSON.stringify(searches))
    setRecentSearches(searches)
  }

  const addRecentSearch = (query: string, type: "repositories" | "users") => {
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query,
      type,
      timestamp: new Date()
    }

    const filtered = recentSearches.filter(
      search => !(search.query === query && search.type === type)
    )

    const updated = [newSearch, ...filtered].slice(0, 5)
    saveRecentSearches(updated)
  }

  const removeRecentSearch = (id: string) => {
    const updated = recentSearches.filter(search => search.id !== id)
    saveRecentSearches(updated)
  }

  const handleSearch = (searchQuery?: string, searchSearchType?: "repositories" | "users") => {
    const finalQuery = searchQuery || query
    const finalType = searchSearchType || searchType

    if (finalQuery.trim()) {
      addRecentSearch(finalQuery, finalType)
      router.push(`/search/${finalType}?q=${encodeURIComponent(finalQuery)}`)
      setIsCommandOpen(false)
      setQuery("")
    }
  }

  const handleRecentSearch = (search: RecentSearch) => {
    handleSearch(search.query, search.type)
  }

  const handleInputFocus = () => {
    setIsCommandOpen(true)
  }

  const handleOverlayClick = () => {
    setIsCommandOpen(false)
  }

  const clearAllRecentSearches = () => {
    saveRecentSearches([])
  }

  return (
    <>
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => router.push('/')}
              className="text-xl font-bold cursor-pointer"
            >
              GitHub Search
            </div>
            {/* Desktop search bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <button
                  onClick={handleInputFocus}
                  className="w-full h-10 px-4 text-left text-gray-500 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Search repositories and users...</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile search button */}
            <button
              onClick={handleInputFocus}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Command Menu Overlay */}
      {isCommandOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <div className="flex items-start justify-center pt-24">
            <div 
              className="w-full max-w-3xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-0">
                {/* Search Input Section */}
                <div className="relative rounded px-2.5 pt-2.5">
                  <div className="flex h-9 gap-3">
                    <div className="flex-1 relative bg-[#f2f2f2] rounded-lg">
                      <Search className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                      <input
                          type="text"
                          placeholder={`Search ${searchType}...`}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch()
                            }
                          }}
                          className="w-full h-full pl-8 md:pl-12 pr-4  text-sm md:text-lg border-0 focus:outline-none bg-transparent"
                          autoFocus
                      />
                    </div>

                    <div className="flex rounded-lg p-1 bg-[#f2f2f2] gap-1">
                      <button
                          onClick={() => setSearchType("repositories")}
                          className={`p-1 hover:bg-gray-50 transition-colors rounded-lg ${
                              searchType === "repositories" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                          }`}
                          title="Search Repositories"
                      >
                        <GitBranch className="h-5 w-5"/>
                      </button>
                      <div className="h-full w-px bg-gray-300"></div>
                      <button
                          onClick={() => setSearchType("users")}
                          className={`p-1 hover:bg-gray-50 transition-colors rounded-lg ${
                              searchType === "users" ? "bg-green-50 text-green-600" : "text-gray-600"
                          }`}
                          title="Search Users"
                      >
                        <User className="h-5 w-5"/>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Searches Section */}
                <div className="p-4 min-h-[200px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="h-4 w-4"/>
                      Recent searches
                    </div>
                    {recentSearches.length > 0 && (
                      <button
                          onClick={clearAllRecentSearches}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  {recentSearches.length > 0 ? (
                    <div className="space-y-1">
                      {recentSearches.map((search) => (
                        <div
                          key={search.id}
                          className="flex items-center justify-between group hover:bg-gray-50 rounded-md px-3 py-2 transition-colors gap-1 cursor-pointer"
                        >
                          <button
                            onClick={() => handleRecentSearch(search)}
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                              search.type === "repositories" 
                                ? "bg-blue-100 text-blue-600" 
                                : "bg-green-100 text-green-600"
                            }`}>
                              {search.type === "repositories" ? (
                                <GitBranch className="h-3 w-3 shrink-0" />
                              ) : (
                                <User className="h-3 w-3 shrink-0" />
                              )}
                            </div>
                            <div className="max-w-full">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1 break-all">{search.query}</div>
                              <div className="text-xs text-gray-500 capitalize">{search.type}</div>
                            </div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecentSearch(search.id)
                            }}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                          >
                            <X className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        searchType === "repositories" 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-green-100 text-green-600"
                      }`}>
                        {searchType === "repositories" ? (
                          <GitBranch className="h-6 w-6" />
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">No recent searches</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Start searching for {searchType} to see your history here
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                  <div className="text-xs text-gray-500">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs leading-6">Enter</kbd> to search
                    or click the icons to switch between repositories and users
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}