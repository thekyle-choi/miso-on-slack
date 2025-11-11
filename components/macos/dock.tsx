"use client"

import { useState } from "react"
import { 
  MessageSquare, 
  Mail, 
  Music, 
  Camera, 
  FileText, 
  Chrome,
  Folder
} from "lucide-react"
import Image from "next/image"

interface DockProps {
  onSlackClick?: () => void
  isSlackOpen?: boolean
}

type DockApp = {
  icon?: React.ComponentType<{ className?: string }>
  iconPath?: string
  label: string
  color: string
}

// Dock 아이콘 컴포넌트 (이미지 로드 실패 시 fallback 처리)
function DockIcon({ app }: { app: DockApp }) {
  const [imageError, setImageError] = useState(false)
  const Icon = app.icon

  if (!app.iconPath || imageError) {
    return Icon ? <Icon className="w-7 h-7 text-gray-700" /> : null
  }

  return (
    <div className="relative w-full h-full -m-1">
      <Image
        src={app.iconPath}
        alt={app.label}
        fill
        className="object-contain scale-110"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export function MacDock({ onSlackClick, isSlackOpen }: DockProps) {
  const dockApps: DockApp[] = [
    { iconPath: "/icons/chrome-icon.png", icon: Chrome, label: "Chrome", color: "bg-red-500" },
    { iconPath: "/icons/finder-icon.png", icon: Folder, label: "Finder", color: "bg-blue-500" },
    { iconPath: "/icons/messages-icon.png", icon: MessageSquare, label: "Messages", color: "bg-green-500" },
    { iconPath: "/icons/mail-icon.png", icon: Mail, label: "Mail", color: "bg-blue-600" },
    { iconPath: "/icons/music-icon.png", icon: Music, label: "Music", color: "bg-pink-500" },
    { iconPath: "/icons/photos-icon.png", icon: Camera, label: "Photos", color: "bg-yellow-500" },
    { iconPath: "/icons/notes-icon.png", icon: FileText, label: "Notes", color: "bg-yellow-400" },
  ]

  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-end gap-2 px-3 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl">
        {/* Slack 앱 아이콘 (특별 처리) */}
        <button
          onClick={() => {
            console.log("Dock Slack button clicked!")
            onSlackClick?.()
          }}
          className="group relative flex items-center justify-center w-14 h-14 rounded-xl bg-white hover:scale-110 transition-transform duration-200 shadow-lg overflow-hidden"
        >
          <div className="relative w-10 h-10">
            <Image
              src="/icons/slack-icon.png"
              alt="Slack"
              fill
              className="object-contain"
            />
          </div>
          {/* 열려있음 표시 */}
          {isSlackOpen && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
          )}
          {/* 툴팁 */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Slack
          </div>
        </button>

        {/* Miso 앱 아이콘 */}
        <button
          className="group relative flex items-center justify-center w-14 h-14 rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg overflow-hidden"
        >
          <div className="relative w-full h-full -m-1">
            <Image
              src="/icons/miso-icon.png"
              alt="Miso"
              fill
              className="object-contain scale-110"
            />
          </div>
          {/* 툴팁 */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Miso
          </div>
        </button>

        {/* 구분선 */}
        <div className="w-px h-12 bg-white/20 mx-1" />

        {/* 다른 앱들 */}
        {dockApps.map((app, index) => (
          <button
            key={index}
            className="group relative flex items-center justify-center w-14 h-14 rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg overflow-hidden"
          >
            <DockIcon app={app} />
            {/* 툴팁 */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {app.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

