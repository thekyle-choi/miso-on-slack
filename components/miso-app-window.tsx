"use client"

import { X, Minus, Maximize2 } from "lucide-react"

interface MisoAppWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MisoAppWindow({ isOpen, onClose }: MisoAppWindowProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS 스타일 타이틀 바 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 shrink-0">
          {/* 왼쪽: macOS 윈도우 컨트롤 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer group relative"
              aria-label="닫기"
            >
              <X className="h-2 w-2 text-red-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer group relative"
              aria-label="최소화"
              onClick={onClose}
            >
              <Minus className="h-2 w-2 text-yellow-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer group relative"
              aria-label="최대화"
            >
              <Maximize2 className="h-2 w-2 text-green-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* 오른쪽: 빈 공간 (레이아웃 균형을 위해) */}
          <div className="w-[60px]"></div>
        </div>

        {/* iframe 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden bg-white">
          <iframe
            src="https://52g.miso.gs"
            className="w-full h-full border-0"
            title="MISO"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
          />
        </div>
      </div>
    </div>
  )
}

