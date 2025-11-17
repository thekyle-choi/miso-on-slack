"use client"

import { useState } from "react"
import { MacDesktop } from "@/components/macos/desktop"
import { MacAppWindow } from "@/components/macos/app-window"
import { SlackApp } from "@/components/slack/slack-app"
import { BootScreen } from "@/components/macos/boot-screen"
import { BrowserWindow } from "@/components/browser-window"
import { FinderWindow } from "@/components/finder-window"
import { MisoAppWindow } from "@/components/miso-app-window"
import { PhotosWindow } from "@/components/photos-window"
import type { DesktopAsset } from "@/constants/desktop-assets"

export default function Home() {
  const [isSlackOpen, setIsSlackOpen] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [isBrowserOpen, setIsBrowserOpen] = useState(false)
  const [isFinderOpen, setIsFinderOpen] = useState(false)
  const [isMisoOpen, setIsMisoOpen] = useState(false)
  const [isPhotosOpen, setIsPhotosOpen] = useState(false)
  const [browserInitialUrl, setBrowserInitialUrl] = useState("https://www.52g.gs")
  const [queuedAttachments, setQueuedAttachments] = useState<DesktopAsset[]>([])

  const handleSlackClick = () => {
    console.log("Slack clicked, opening window...")
    setIsSlackOpen(true)
  }

  const handleSlackClose = () => {
    console.log("Closing Slack window...")
    setIsSlackOpen(false)
  }

  const handleSlackMinimize = () => {
    console.log("Minimizing Slack window...")
    setIsSlackOpen(false)
  }

  const handleSlackMaximize = () => {
    console.log("Maximizing Slack window...")
    // 최대화 기능은 나중에 구현 가능
  }

  const handleBootComplete = () => {
    setIsBooting(false)
  }

  const handleChromeClick = () => {
    setBrowserInitialUrl("https://www.52g.gs")
    setIsBrowserOpen(true)
  }

  const handleMisoClick = () => {
    setIsMisoOpen(true)
  }

  const handleMisoClose = () => {
    setIsMisoOpen(false)
  }

  const handleBrowserClose = () => {
    setIsBrowserOpen(false)
  }

  const handleFinderClick = () => {
    setIsFinderOpen(true)
  }

  const handleFinderClose = () => {
    setIsFinderOpen(false)
  }

  const handlePhotosClick = () => {
    setIsPhotosOpen(true)
  }

  const handlePhotosClose = () => {
    setIsPhotosOpen(false)
  }

  const handleQueueAttachment = (asset: DesktopAsset) => {
    setQueuedAttachments((prev) => [...prev, asset])
    setIsSlackOpen(true)
  }

  const handleExternalAttachmentsConsumed = (assetIds: string[]) => {
    if (!assetIds.length) return
    setQueuedAttachments((prev) => prev.filter((asset) => !assetIds.includes(asset.id)))
  }

  console.log("isSlackOpen:", isSlackOpen)

  return (
    <>
      {/* 바탕화면은 항상 렌더링 */}
      <MacDesktop
        onSlackClick={handleSlackClick}
        isSlackOpen={isSlackOpen}
        onChromeClick={handleChromeClick}
        onMisoClick={handleMisoClick}
        onFinderClick={handleFinderClick}
        onPhotosClick={handlePhotosClick}
      >
        <MacAppWindow
          title="Slack"
          isOpen={isSlackOpen}
          onClose={handleSlackClose}
          defaultWidth={1268}
          defaultHeight={800}
        >
          <SlackApp 
            onClose={handleSlackClose}
            onMinimize={handleSlackMinimize}
            onMaximize={handleSlackMaximize}
            externalAttachments={queuedAttachments}
            onExternalAttachmentsConsumed={handleExternalAttachmentsConsumed}
          />
        </MacAppWindow>
      </MacDesktop>
      
      {/* 로딩 화면이 위에 덮여있다가 페이드아웃 */}
      {isBooting && <BootScreen onComplete={handleBootComplete} />}
      
      {/* 브라우저 윈도우 */}
      <BrowserWindow 
        isOpen={isBrowserOpen} 
        onClose={handleBrowserClose}
        defaultUrl={browserInitialUrl}
      />
      
      {/* Finder 윈도우 */}
      <FinderWindow 
        isOpen={isFinderOpen}
        onClose={handleFinderClose}
        onAttach={handleQueueAttachment}
      />
      
      {/* Miso 앱 윈도우 */}
      <MisoAppWindow 
        isOpen={isMisoOpen}
        onClose={handleMisoClose}
      />
      
      {/* Photos 앱 윈도우 */}
      <PhotosWindow 
        isOpen={isPhotosOpen}
        onClose={handlePhotosClose}
        onAttach={handleQueueAttachment}
      />
    </>
  )
}
