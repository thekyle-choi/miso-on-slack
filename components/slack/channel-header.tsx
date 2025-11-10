"use client"

import { Star, Lock, Users, Headphones, ChevronDown, Bell, Search, MoreVertical } from "lucide-react"

interface ChannelHeaderProps {
  channelName: string
  memberCount: number
}

export function ChannelHeader({ channelName, memberCount }: ChannelHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-gray-100 rounded" aria-label="Bookmark">
          <Star className="w-4 h-4 text-gray-600" />
        </button>
        <Lock className="w-4 h-4 text-gray-700" />
        <h1 className="text-[15px] font-bold text-gray-900">{channelName}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1 rounded" aria-label="Members">
          <Users className="w-[18px] h-[18px] text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{memberCount}</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded" aria-label="Huddle">
          <Headphones className="w-[18px] h-[18px] text-gray-600" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" aria-label="Notifications">
          <Bell className="w-[18px] h-[18px] text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" aria-label="Search">
          <Search className="w-[18px] h-[18px] text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" aria-label="More">
          <MoreVertical className="w-[18px] h-[18px] text-gray-600" />
        </button>
      </div>
    </div>
  )
}

