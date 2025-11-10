"use client"

import { useState } from "react"
import { MacDesktop } from "@/components/macos/desktop"
import { MacAppWindow } from "@/components/macos/app-window"
import { SlackApp } from "@/components/slack/slack-app"
import { BootScreen } from "@/components/macos/boot-screen"

export default function Home() {
  const [isSlackOpen, setIsSlackOpen] = useState(false)
  const [isBooting, setIsBooting] = useState(true)

  const handleSlackClick = () => {
    console.log("Slack clicked, opening window...")
    setIsSlackOpen(true)
  }

  const handleSlackClose = () => {
    console.log("Closing Slack window...")
    setIsSlackOpen(false)
  }

  const handleBootComplete = () => {
    setIsBooting(false)
  }

  console.log("isSlackOpen:", isSlackOpen)

  return (
    <>
      {/* 바탕화면은 항상 렌더링 */}
      <MacDesktop onSlackClick={handleSlackClick} isSlackOpen={isSlackOpen}>
        <MacAppWindow
          title="Slack"
          isOpen={isSlackOpen}
          onClose={handleSlackClose}
          defaultWidth={1200}
          defaultHeight={800}
        >
          <SlackApp />
        </MacAppWindow>
      </MacDesktop>
      
      {/* 로딩 화면이 위에 덮여있다가 페이드아웃 */}
      {isBooting && <BootScreen onComplete={handleBootComplete} />}
    </>
  )
}
