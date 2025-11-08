"use client"

import { useState } from "react"
import { RepositoryResults } from "./RepositoryResults"
import { UserResults } from "./UserResults"
import { SearchFilters } from "./SearchFilters"

interface SearchResultsProps {
  query: string
  searchType: "repositories" | "users"
}

export function SearchResults({ query, searchType }: SearchResultsProps) {
  const [filters, setFilters] = useState<any>({})

  if (!query) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Enter a search term to find repositories and users</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 break-words">Search Results</h2>
        <SearchFilters 
          searchType={searchType}
          onFiltersChange={setFilters}
        />
      </div>
      
      {searchType === "repositories" ? (
        <RepositoryResults 
          repositories={[]}
          isLoading={false}
          isError={false}
          totalCount={0}
        />
      ) : (
        <UserResults 
          users={[]}
          isLoading={false}
          isError={false}
          totalCount={0}
        />
      )}
    </div>
  )
}