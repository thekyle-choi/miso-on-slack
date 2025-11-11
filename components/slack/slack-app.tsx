"use client"

import { useState, useCallback, useRef } from "react"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { SlackSidebar } from "@/components/slack-sidebar"
import { SlackTopbar } from "@/components/slack-topbar"
import { SlackInput } from "@/components/slack-input"
import { ChannelHeader } from "./channel-header"
import { ChannelTabs } from "./channel-tabs"
import { DateSeparator } from "./date-separator"
import { MessagesList } from "./messages-list"
import { MOCK_MESSAGES, type Message } from "@/constants/messages"

interface SlackAppProps {
  channelName?: string
  memberCount?: number
  date?: string
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

export function SlackApp({
  channelName = "gs-holdings-52g-salesforce-slack",
  memberCount = 13,
  date = "11월 7일 금요일",
  onClose,
  onMinimize,
  onMaximize,
}: SlackAppProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const chatAreaRef = useRef<HTMLDivElement>(null)

  // 현재 시간 포맷팅 함수
  const getCurrentTime = useCallback(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`
  }, [])

  // 메시지 전송 핸들러
  const handleMessageSent = useCallback(
    (messageText: string, result?: string) => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const displayHours = hours % 12 || 12
      const timeString = `${ampm} ${displayHours}:${minutes.toString().padStart(2, "0")}`

      // 빈 문자열이 아니면 사용자 메시지 추가
      if (messageText) {
        const userMessage: Message = {
          sender: "You",
          time: timeString,
          content: messageText,
          avatar: "/assets/mini_kyle_default.png",
        }

        setMessages((prev) => [...prev, userMessage])

        // /tbm 명령어인 경우 로딩 메시지 추가
        if (messageText.startsWith("/tbm")) {
          const loadingMessage: Message = {
            sender: "안젠봇",
            time: timeString,
            content: "답변을 준비하고 있습니다...",
            avatar: "/placeholder.svg",
            isBot: true,
            isLoading: true,
          }
          setMessages((prev) => [...prev, loadingMessage])
        }
      }

      // MISO 결과가 있으면 로딩 메시지를 실제 결과로 교체
      if (result) {
        setMessages((prev) => {
          // 로딩 메시지 제거
          const withoutLoading = prev.filter((msg) => !msg.isLoading)
          
          // 실제 결과 메시지 추가
          const botMessage: Message = {
            sender: "안젠봇",
            time: timeString,
            content: "MISO 워크플로우 결과",
            avatar: "/placeholder.svg",
            isBot: true,
            misoResult: result,
          }
          
          return [...withoutLoading, botMessage]
        })
      }
    },
    []
  )

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* 상단바가 전체 너비로 확장 */}
      <SlackTopbar onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
      
      <div className="flex flex-1 min-h-0">
        <WorkspaceSwitcher />
        <SlackSidebar />

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <ChannelHeader channelName={channelName} memberCount={memberCount} />

          <ChannelTabs />

          <div ref={chatAreaRef} className="flex-1 relative min-h-0">
            <DateSeparator date={date} />

            <MessagesList 
              messages={messages} 
              containerRef={chatAreaRef}
            />
          </div>

          <SlackInput onMessageSent={handleMessageSent} />
        </div>
      </div>
    </div>
  )
}

