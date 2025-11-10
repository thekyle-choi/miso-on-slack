"use client"

import { MacMenuBar } from "./menu-bar"
import { MacDock } from "./dock"

interface DesktopProps {
  children?: React.ReactNode
  onSlackClick?: () => void
  isSlackOpen?: boolean
}

export function MacDesktop({ children, onSlackClick, isSlackOpen }: DesktopProps) {
  const activeApp = isSlackOpen ? "slack" : "finder"

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* macOS 배경 - 고화질 이미지 */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3840&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* 메뉴바 */}
      <MacMenuBar activeApp={activeApp} />
      
      {/* 앱 윈도우들 */}
      <div className="relative w-full h-full pt-7">
        {children}
      </div>
      
      {/* Dock */}
      <MacDock onSlackClick={onSlackClick} isSlackOpen={isSlackOpen} />
    </div>
  )
}

