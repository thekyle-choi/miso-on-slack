"use client"

import { Search, HelpCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react"

export function SlackTopbar() {
  return (
    <div className="h-[49px] bg-[#350D36] border-b border-[#522653] flex items-center px-4 text-white flex-shrink-0">
      {/* macOS Window Controls */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-1 mr-4">
        <button className="p-1 hover:bg-white/10 rounded transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-white/10 rounded transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Clock */}
      <div className="mr-4">
        <Clock className="w-4 h-4 text-white/70" />
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search 52g"
            className="w-full pl-9 pr-3 py-1.5 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30"
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white"></div>
          <div className="w-7 h-7 rounded-full bg-blue-400 border-2 border-white"></div>
        </div>
      </div>
    </div>
  )
}
