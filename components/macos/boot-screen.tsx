"use client"

import { useEffect, useState } from "react"

interface BootScreenProps {
  onComplete: () => void
}

// macOS 스타일 Apple 로고 SVG 컴포넌트
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // 로딩 시간: 애니메이션 시간과 동일하게 설정 (1.5초)
    const loadingDuration = 1500
    const fadeOutDuration = 500

    const timer = setTimeout(() => {
      setIsVisible(false)
      // 페이드아웃 후 완료 콜백 호출
      setTimeout(() => {
        onComplete()
      }, fadeOutDuration)
    }, loadingDuration)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 pointer-events-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {/* Apple 로고 */}
        <div className="mb-12">
          <AppleLogo className="w-16 h-16 text-white" />
        </div>

        {/* 로딩바 */}
        <div className="w-64 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-macos-loading origin-left" />
        </div>
      </div>
    </div>
  )
}

