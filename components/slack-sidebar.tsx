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
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-1 transition-colors">
            <Star className="w-4 h-4 shrink-0" />
            <span className="text-white/80 font-semibold">즐겨찾기</span>
          </button>
          <div className="text-xs text-white/50 px-2 py-1.5 leading-relaxed">
            자주 사용하는 채널과 메시지를 쉽게 찾을 수 있도록 추가하세요
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
                  ? "bg-[#1164A3] hover:bg-[#0D4F85] text-white"
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
                  ? "bg-[#1164A3] hover:bg-[#0D4F85] text-white"
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
                  ? "bg-[#1164A3] hover:bg-[#0D4F85] text-white"
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
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <Hash className="w-4 h-4 shrink-0" />
              <span>랜덤</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M7 8h10M7 12h10m-7 4h7" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span>미소-중요정보</span>
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
              <div className="w-5 h-5 rounded-sm bg-purple-400 shrink-0 relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute -bottom-0.5 -right-0.5 border border-[#4A154B]"></div>
              </div>
              <span className="truncate">Zoey(이수민)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-green-400 shrink-0"></div>
              <span className="truncate">Heather</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="relative shrink-0">
                <div className="w-5 h-5 rounded-sm bg-pink-400"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Julie 박주리</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-blue-400 shrink-0 relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute -bottom-0.5 -right-0.5 border border-[#4A154B]"></div>
              </div>
              <span className="truncate">Ally 김진아 52g</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-yellow-400 shrink-0"></div>
              <span className="truncate">keaton</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-red-400 shrink-0 relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute -bottom-0.5 -right-0.5 border border-[#4A154B]"></div>
              </div>
              <span className="truncate">Jin(이진수)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-indigo-400 shrink-0"></div>
              <span className="truncate">Bob(박종협)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-orange-400 shrink-0"></div>
              <span className="truncate">Ronny(장성욱)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white transition-colors">
              <div className="w-5 h-5 rounded-sm bg-teal-400 shrink-0 relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute -bottom-0.5 -right-0.5 border border-[#4A154B]"></div>
              </div>
              <span className="truncate">BOM(박은아)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
