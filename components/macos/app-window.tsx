"use client"

import { useState, useRef } from "react"
import { X, Minus, Maximize2 } from "lucide-react"

interface AppWindowProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  defaultWidth?: number
  defaultHeight?: number
}

export function MacAppWindow({
  title,
  children,
  isOpen,
  onClose,
  defaultWidth = 1200,
  defaultHeight = 800,
}: AppWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMinimize = () => {
    setIsMinimizing(true)
    setTimeout(() => {
      onClose()
      setIsMinimizing(false)
    }, 300)
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const scale = isMinimizing ? 0.95 : 1
  const opacity = isMinimizing || !isOpen ? 0 : 1
  const pointerEvents = isOpen ? 'auto' : 'none'

  if (!isOpen && !isMinimizing) return null

  return (
    <div
      ref={windowRef}
      className={`
        fixed z-50 bg-white rounded-lg shadow-2xl overflow-hidden
        transition-all duration-200 ease-out
        ${isMaximized ? 'inset-4' : ''}
      `}
      style={
        isMaximized
          ? {
              opacity,
              pointerEvents,
            }
          : {
              width: `${defaultWidth}px`,
              height: `${defaultHeight}px`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              pointerEvents,
            }
      }
      onClick={(e) => e.stopPropagation()}
    >
      {/* 타이틀 바 */}
      <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4 cursor-move select-none">
        {/* 트래픽 라이트 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors group relative"
            aria-label="닫기"
          >
            <X className="w-2 h-2 text-[#8B0000] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors group relative"
            aria-label="최소화"
          >
            <Minus className="w-2 h-2 text-[#8B6914] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors group relative"
            aria-label="최대화"
          >
            <Maximize2 className="w-2 h-2 text-[#0F5623] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* 타이틀 */}
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-gray-700">
          {title}
        </div>

        {/* 빈 공간 (대칭을 위해) */}
        <div className="w-16" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="h-[calc(100%-3rem)] overflow-hidden">
        {children}
      </div>
    </div>
  )
}
