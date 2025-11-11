"use client"

import { MacMenuBar } from "./menu-bar"
import { MacDock } from "./dock"

interface DesktopProps {
  children?: React.ReactNode
  onSlackClick?: () => void
  isSlackOpen?: boolean
  onChromeClick?: () => void
  onMisoClick?: () => void
  onFinderClick?: () => void
  onPhotosClick?: () => void
}

export function MacDesktop({ children, onSlackClick, isSlackOpen, onChromeClick, onMisoClick, onFinderClick, onPhotosClick }: DesktopProps) {
  const activeApp = isSlackOpen ? "slack" : "finder"

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* macOS 배경 - Slack Miso 월페이퍼 */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/assets/slack_miso_wallpaper.png")',
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
      <MacDock 
        onSlackClick={onSlackClick} 
        isSlackOpen={isSlackOpen} 
        onChromeClick={onChromeClick}
        onMisoClick={onMisoClick}
        onFinderClick={onFinderClick}
        onPhotosClick={onPhotosClick}
      />
    </div>
  )
}

