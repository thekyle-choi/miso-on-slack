"use client"

import { useState, useRef } from "react"

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
  const [isMinimizing, setIsMinimizing] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const scale = isMinimizing ? 0.95 : 1
  const opacity = isMinimizing || !isOpen ? 0 : 1
  const pointerEvents = isOpen ? 'auto' : 'none'

  if (!isOpen && !isMinimizing) return null

  return (
    <div
      ref={windowRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-200 ease-out"
      style={{
        width: `${defaultWidth}px`,
        height: `${defaultHeight}px`,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 콘텐츠 영역 - 타이틀바 제거하여 전체 높이 사용 */}
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}
