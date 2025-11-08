"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/ui"
import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  searchType: "repositories" | "users"
  onFiltersChange: (filters: any) => void
  className?: string
}

export function SearchFilters({ searchType, onFiltersChange, className }: SearchFiltersProps) {
  const [sort, setSort] = useState("best-match")
  const [isOpen, setIsOpen] = useState(false)

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    onFiltersChange({ sort: newSort })
  }

  const sortOptions = searchType === "repositories" 
    ? [
        { value: "best-match", label: "Best match" },
        { value: "stars-asc", label: "Fewest stars" },
        { value: "stars", label: "Most stars" },
        { value: "updated", label: "Recently updated" },
      ]
    : [
        { value: "best-match", label: "Best match" },
        { value: "followers", label: "Most followers" },
        { value: "followers-asc", label: "Fewest followers" },
        { value: "repositories", label: "Most repos" },
        { value: "repositories-asc", label: "Fewer repos" },
      ]

  const selectedSortOption = sortOptions.find(option => option.value === sort)

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2 min-w-[160px] justify-between"
        >
          <span>{selectedSortOption?.label || "Sort by"}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleSortChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
                  sort === option.value && "bg-blue-50 text-blue-700"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}