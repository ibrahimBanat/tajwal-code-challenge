"use client"

import { Search, GitBranch, GitMerge, Settings, BarChart3, Calendar, Play, FileText, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui"

const navigation = [
  { name: "Project", icon: FolderOpen, href: "#", current: false },
  { name: "Repository", icon: GitBranch, href: "#", current: false },
  { name: "Issues", icon: FileText, href: "#", current: false },
  { name: "Merge Requests", icon: GitMerge, href: "#", current: false },
  {
    name: "CI/CD",
    icon: Settings,
    href: "#",
    current: true,
    children: [
      { name: "Pipelines", href: "#", current: true },
      { name: "Jobs", href: "#", current: false },
      { name: "Schedules", href: "#", current: false },
      { name: "Charts", href: "#", current: false },
    ]
  },
]

export function Sidebar() {
  return (
    <div className="bg-tajawal-sidebar border-r border-border-subtle w-72 flex flex-col h-full">
      {/* Project Header */}
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-tajawal-orange rounded flex items-center justify-center text-white font-semibold text-sm">
            T
          </div>
          <div>
            <h2 className="text-tajawal-text-primary font-semibold">Tajawal</h2>
            <p className="text-tajawal-text-muted text-sm">GitHub Search</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tajawal-text-muted h-4 w-4" />
          <Input
            placeholder="Search or jump to..."
            className="pl-10 bg-tajawal-surface border-border-default text-tajawal-text-primary placeholder:text-tajawal-text-muted"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            <a
              href={item.href}
              className={cn(
                item.current
                  ? "bg-tajawal-green text-white"
                  : "text-tajawal-text-secondary hover:text-tajawal-text-primary hover:bg-tajawal-surface-hover",
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              )}
            >
              <item.icon
                className={cn(
                  item.current ? "text-white" : "text-tajawal-text-muted group-hover:text-tajawal-text-primary",
                  "mr-3 h-5 w-5"
                )}
              />
              {item.name}
            </a>
            
            {item.children && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => (
                  <a
                    key={child.name}
                    href={child.href}
                    className={cn(
                      child.current
                        ? "text-tajawal-green bg-tajawal-green/10"
                        : "text-tajawal-text-secondary hover:text-tajawal-text-primary hover:bg-tajawal-surface-hover",
                      "group flex items-center px-3 py-2 text-sm rounded-md transition-colors"
                    )}
                  >
                    <div className={cn(
                      child.current ? "bg-tajawal-green" : "bg-tajawal-text-muted",
                      "w-2 h-2 rounded-full mr-3"
                    )} />
                    {child.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}