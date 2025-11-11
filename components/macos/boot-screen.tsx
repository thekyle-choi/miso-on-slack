"use client"

import { useEffect, useState } from "react"

interface BootScreenProps {
  onComplete: () => void
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
        {/* Slack Miso 캐릭터 */}
        <div className="mb-1">
          <img 
            src="/assets/slack_miso_removebg.png" 
            alt="Slack Miso" 
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* 텍스트 */}
        <div className="mb-12">
          <p className="text-white font-mono text-sm tracking-wider">
            miso on slack
          </p>
        </div>

        {/* 로딩바 */}
        <div className="w-64 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-macos-loading origin-left" />
        </div>
      </div>
    </div>
  )
}

