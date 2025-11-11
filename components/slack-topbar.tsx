"use client"

import { Search, HelpCircle, ChevronLeft, ChevronRight, Clock, X, Minus, Maximize2 } from "lucide-react"

interface SlackTopbarProps {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

export function SlackTopbar({ onClose, onMinimize, onMaximize }: SlackTopbarProps) {
  return (
    <div className="h-[44px] bg-[#350D36] border-b border-[#522653] flex items-center text-white flex-shrink-0">
      {/* Left Section: Traffic Lights - 워크스페이스 영역 너비만큼 */}
      <div className="w-[68px] flex items-center justify-center gap-1.5 px-3">
        {/* Traffic Light Buttons */}
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors group relative"
          aria-label="닫기"
        >
          <X className="w-2 h-2 text-[#8B0000] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
        </button>
        <button
          onClick={onMinimize}
          className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors group relative"
          aria-label="최소화"
        >
          <Minus className="w-2 h-2 text-[#8B6914] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
        </button>
        <button
          onClick={onMaximize}
          className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors group relative"
          aria-label="최대화"
        >
          <Maximize2 className="w-2 h-2 text-[#0F5623] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
        </button>
      </div>

      {/* Sidebar Width Spacer - 사이드바 영역만큼 공간 확보 */}
      <div className="w-[260px]"></div>

      {/* Middle Section: Navigation Arrows + Search - 사이드바 우측 라인부터 시작 */}
      <div className="flex items-center gap-3 px-4 flex-1">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <Clock className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[600px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="52g 검색"
              className="w-full pl-9 pr-3 py-1.5 bg-[#522653] border border-[#522653] rounded text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right Section: Help Icon */}
      <div className="flex items-center gap-2 px-4">
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  )
}
