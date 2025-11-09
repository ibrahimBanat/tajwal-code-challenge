"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchStore } from "@/features/search/store"
import { Input } from "@/components/ui"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  className?: string
  placeholder?: string
}

export function SearchInput({ className, placeholder = "Search repositories and users..." }: SearchInputProps) {
  const [localQuery, setLocalQuery] = useState("")
  const { setQuery, setSearchType, searchType } = useSearchStore()
  
  const debouncedQuery = useDebounce(localQuery, 500)

  useEffect(() => {
    setQuery(debouncedQuery)
  }, [debouncedQuery, setQuery])

  const handleSearchTypeChange = (type: "repositories" | "users") => {
    setSearchType(type)
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tajawal-text-muted h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10 bg-tajawal-surface border-border-default text-tajawal-text-primary placeholder:text-tajawal-text-muted focus:border-tajawal-green focus:ring-tajawal-green/20"
        />
      </div>
      
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleSearchTypeChange("repositories")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            searchType === "repositories"
              ? "bg-tajawal-green text-white hover:bg-tajawal-green/90"
              : "bg-tajawal-surface text-tajawal-text-secondary border border-border-default hover:bg-tajawal-surface-hover hover:text-tajawal-text-primary"
          )}
        >
          Repositories
        </button>
        <button
          onClick={() => handleSearchTypeChange("users")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            searchType === "users"
              ? "bg-tajawal-green text-white hover:bg-tajawal-green/90"
              : "bg-tajawal-surface text-tajawal-text-secondary border border-border-default hover:bg-tajawal-surface-hover hover:text-tajawal-text-primary"
          )}
        >
          Users
        </button>
      </div>
    </div>
  )
}