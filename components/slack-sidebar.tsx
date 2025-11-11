"use client"

import { ChevronDown, Hash, Star, Edit2, MessageSquare, MoreHorizontal, Users, Smile, Headphones } from "lucide-react"

interface SlackSidebarProps {
  currentChannel?: string
  onChannelChange?: (channel: string) => void
}

export function SlackSidebar({ currentChannel, onChannelChange }: SlackSidebarProps) {
  return (
    <div className="w-[260px] h-full bg-[#4A154B] text-white flex flex-col border-r border-[#350D36]">
      {/* Workspace Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <button className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1.5 flex-1 min-w-0 transition-colors">
            <span className="font-bold text-[18px] truncate">52g</span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors shrink-0">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 scrollbar-hover-dark">
        {/* Main Navigation */}
        <div className="mb-5">
          <button className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white transition-colors">
            <Smile className="w-4 h-4 shrink-0" />
            <span>시작하기</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>스레드</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white transition-colors">
            <Headphones className="w-4 h-4 shrink-0" />
            <span>허들</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white transition-colors">
            <Users className="w-4 h-4 shrink-0" />
            <span>디렉터리</span>
          </button>
        </div>

        {/* Favorites Section */}
        <div className="mb-5">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-0.5 transition-colors">
            <ChevronDown className="w-4 h-4 shrink-0" />
            <span className="text-white/80 font-semibold">즐겨찾기</span>
          </button>
          <div className="space-y-0.5 mt-1">
            <button 
              onClick={() => onChannelChange?.("anjenbot-safety-bot")}
              className={`flex items-center gap-2 px-2 py-1 rounded w-full text-sm transition-colors ${
                currentChannel === "anjenbot-safety-bot"
                  ? "bg-white hover:bg-gray-100 text-gray-900"
                  : "hover:bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Star className={`w-4 h-4 shrink-0 ${
                currentChannel === "anjenbot-safety-bot"
                  ? "fill-yellow-500 text-yellow-500"
                  : "fill-yellow-400 text-yellow-400"
              }`} />
              <span className="truncate">AnGenBot(Safety Bot)</span>
            </button>
            <button 
              onClick={() => onChannelChange?.("plai-maker")}
              className={`flex items-center gap-2 px-2 py-1 rounded w-full text-sm transition-colors ${
                currentChannel === "plai-maker"
                  ? "bg-white hover:bg-gray-100 text-gray-900"
                  : "hover:bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Star className={`w-4 h-4 shrink-0 ${
                currentChannel === "plai-maker"
                  ? "fill-yellow-500 text-yellow-500"
                  : "fill-yellow-400 text-yellow-400"
              }`} />
              <span className="truncate">PLAI MAKER</span>
            </button>
          </div>
        </div>

        {/* External Connections Section */}
        <div className="mb-5">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-0.5 transition-colors">
            <ChevronDown className="w-4 h-4 shrink-0" />
            <span className="text-white/80 font-semibold">외부 연결</span>
          </button>
          <div className="space-y-0.5 mt-1">
            <button 
              onClick={() => onChannelChange?.("gs-52g-powerplant-tbm")}
              className={`flex items-center gap-2 px-2 py-1 rounded w-full text-sm transition-colors ${
                currentChannel === "gs-52g-powerplant-tbm"
                  ? "bg-white hover:bg-gray-100 text-gray-900"
                  : "hover:bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              </svg>
              <span className="truncate">gs-52g-powerplant-tbm</span>
            </button>
            <button 
              onClick={() => onChannelChange?.("gs-52g-design-group")}
              className={`flex items-center gap-2 px-2 py-1 rounded w-full text-sm transition-colors ${
                currentChannel === "gs-52g-design-group"
                  ? "bg-white hover:bg-gray-100 text-gray-900"
                  : "hover:bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              </svg>
              <span className="truncate">gs-52g-design-group</span>
            </button>
          </div>
        </div>

        {/* Channels Section */}
        <div className="mb-5">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-0.5 transition-colors">
            <ChevronDown className="w-4 h-4 shrink-0" />
            <span className="text-white/80 font-semibold">채널</span>
          </button>
          <div className="space-y-0.5 mt-1">
            <button 
              onClick={() => onChannelChange?.("일반")}
              className={`flex items-center gap-2 px-2 py-1 rounded w-full text-sm transition-colors ${
                currentChannel === "일반"
                  ? "bg-white hover:bg-gray-100 text-gray-900"
                  : "hover:bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Hash className="w-4 h-4 shrink-0" />
              <span>일반</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <Hash className="w-4 h-4 shrink-0" />
              <span>52g</span>
            </button>
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="mb-4">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-0.5 transition-colors">
            <ChevronDown className="w-4 h-4 shrink-0" />
            <span className="text-white/80 font-semibold">다이렉트 메시지</span>
          </button>
          <div className="space-y-0.5 mt-1">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="relative shrink-0">
                <img 
                  src="/assets/avatar_ally.jpg" 
                  alt="Ally" 
                  className="w-5 h-5 rounded-sm object-cover"
                />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Ally</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="relative shrink-0">
                <img 
                  src="/assets/avatar_zoey.jpg" 
                  alt="Zoey" 
                  className="w-5 h-5 rounded-sm object-cover"
                />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Zoey</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="relative shrink-0">
                <img 
                  src="/assets/avatar_young.jpg" 
                  alt="Young" 
                  className="w-5 h-5 rounded-sm object-cover"
                />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Young</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="relative shrink-0">
                <img 
                  src="/assets/avatar_leo.jpg" 
                  alt="Leo" 
                  className="w-5 h-5 rounded-sm object-cover"
                />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Leo</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="relative shrink-0">
                <img 
                  src="/assets/avatar_ian.jpg" 
                  alt="Ian" 
                  className="w-5 h-5 rounded-sm object-cover"
                />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Ian</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
