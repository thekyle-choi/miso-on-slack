"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { FaBatteryFull, FaWifi } from "react-icons/fa"

type ActiveApp = "finder" | "slack"

interface MacMenuBarProps {
  activeApp?: ActiveApp
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

export function MacMenuBar({ activeApp = "finder" }: MacMenuBarProps) {
  const [timeString, setTimeString] = useState("")
  const [dateString, setDateString] = useState("")

  useEffect(() => {
    // 클라이언트에서만 시간 업데이트
    const updateTime = () => {
      const now = new Date()
      setTimeString(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
      setDateString(
        now.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "short",
        })
      )
    }

    // 초기 업데이트
    updateTime()

    // 1초마다 업데이트
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const appMenus = {
    finder: [
      { label: "Finder", isBold: true },
      { label: "파일" },
      { label: "편집" },
      { label: "보기" },
      { label: "이동" },
      { label: "윈도우" },
      { label: "도움말" },
    ],
    slack: [
      { label: "Slack", isBold: true },
      { label: "파일" },
      { label: "편집" },
      { label: "보기" },
      { label: "창" },
      { label: "도움말" },
    ],
  }

  const menus = appMenus[activeApp]

  return (
    <div className="absolute top-0 left-0 right-0 h-7 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-3 text-white text-sm z-50">
      {/* 좌측 메뉴 */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors">
          <AppleLogo className="w-4 h-4" />
        </button>
        {menus.map((menu, index) => (
          <button
            key={index}
            className={`hover:bg-white/10 px-2 py-0.5 rounded transition-colors ${
              menu.isBold ? "font-semibold" : ""
            }`}
          >
            {menu.label}
          </button>
        ))}
      </div>

      {/* 우측 상태 아이콘들 */}
      <div className="flex items-center gap-3">
        <button className="hover:bg-white/10 p-1 rounded transition-colors">
          <FaBatteryFull className="w-4 h-4" />
        </button>
        <button className="hover:bg-white/10 p-1 rounded transition-colors">
          <FaWifi className="w-4 h-4" />
        </button>
        <button className="hover:bg-white/10 p-1 rounded transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <div className="text-xs">
          {dateString} {timeString}
        </div>
      </div>
    </div>
  )
}
