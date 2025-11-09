"use client"

import { ChevronRight, Play, MoreHorizontal, RefreshCw } from "lucide-react"
import { Button, Badge } from "@/components/ui"
import { cn } from "@/lib/utils"

const filterTabs = [
  { name: "All", count: 245, active: true },
  { name: "Pending", count: 12, active: false },
  { name: "Running", count: 3, active: false },
  { name: "Passed", count: 198, active: false },
  { name: "Failed", count: 32, active: false },
]

const branchFilters = [
  { name: "Branches", active: true },
  { name: "Tags", active: false },
]

export function Header() {
  return (
    <header className="bg-tajawal-bg border-b border-border-default px-6 py-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-tajawal-text-secondary text-sm">Tajawal</span>
        <ChevronRight className="h-4 w-4 text-tajawal-text-muted" />
        <span className="text-tajawal-text-secondary text-sm">GitHub Search</span>
        <ChevronRight className="h-4 w-4 text-tajawal-text-muted" />
        <span className="text-tajawal-text-primary text-sm font-medium">Pipelines</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.name}
              className={cn(
                tab.active
                  ? "bg-tajawal-surface text-tajawal-text-primary border-border-default"
                  : "text-tajawal-text-secondary hover:text-tajawal-text-primary hover:bg-tajawal-surface-hover",
                "px-3 py-2 text-sm rounded-md border transition-colors flex items-center space-x-2"
              )}
            >
              <span>{tab.name}</span>
              {tab.count && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "ml-1 text-xs",
                    tab.active ? "bg-tajawal-text-muted/20 text-tajawal-text-primary" : "bg-tajawal-surface text-tajawal-text-secondary"
                  )}
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="text-tajawal-text-secondary border-border-default hover:bg-tajawal-surface-hover"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            className="bg-tajawal-green hover:bg-tajawal-green/90 text-white"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Pipeline
          </Button>
        </div>
      </div>

      {/* Branch Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {branchFilters.map((filter) => (
            <button
              key={filter.name}
              className={cn(
                filter.active
                  ? "text-tajawal-text-primary border-b-2 border-tajawal-green"
                  : "text-tajawal-text-secondary hover:text-tajawal-text-primary",
                "pb-2 text-sm font-medium transition-colors"
              )}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-tajawal-text-secondary border-border-default hover:bg-tajawal-surface-hover"
          >
            main
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-tajawal-text-secondary border-border-default hover:bg-tajawal-surface-hover"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}