"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { SlackSidebar } from "@/components/slack-sidebar"
import { SlackTopbar } from "@/components/slack-topbar"
import { SlackInput } from "@/components/slack-input"
import { ChannelHeader } from "./channel-header"
import { ChannelTabs } from "./channel-tabs"
import { MessagesList } from "./messages-list"
import { ChannelWelcome } from "@/components/channel-welcome"
import { MOCK_MESSAGES, CHANNEL_MOCK_MESSAGES, type Message } from "@/constants/messages"

interface SlackAppProps {
  channelName?: string
  memberCount?: number
  date?: string
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

// 채널 정보 타입 정의
type ChannelInfo = {
  name: string
  memberCount: number
}

// 채널 정보 상수
const CHANNELS: Record<string, ChannelInfo> = {
  "일반": {
    name: "일반",
    memberCount: 20,
  },
  "gs-holdings-52g-salesforce-slack": {
    name: "gs-holdings-52g-salesforce-slack",
    memberCount: 13,
  },
  "gs-graphon": {
    name: "gs-graphon",
    memberCount: 8,
  },
  "gs-52g-powerplant-tbm": {
    name: "gs-52g-powerplant-tbm",
    memberCount: 5,
  },
  "gs-52g-design-group": {
    name: "gs-52g-design-group",
    memberCount: 6,
  },
  "anjenbot-safety-bot": {
    name: "AnGenBot(Safety Bot)",
    memberCount: 1,
  },
  "hr-policy-agent": {
    name: "HR Policy Agent",
    memberCount: 1,
  },
  "plai-maker": {
    name: "PLAI MAKER",
    memberCount: 1,
  },
}

const STORAGE_KEY_PREFIX = "slack-messages-"
const TASK_RESULTS_KEY = "slack-task-results"

export function SlackApp({
  channelName: initialChannelName = "일반",
  memberCount: initialMemberCount = 20,
  date = "11월 7일 금요일",
  onClose,
  onMinimize,
  onMaximize,
}: SlackAppProps) {
  // 현재 채널 상태 관리
  const [currentChannel, setCurrentChannel] = useState<string>(initialChannelName)
  const currentChannelInfo = CHANNELS[currentChannel] || CHANNELS[initialChannelName]
  const channelName = currentChannelInfo.name
  const memberCount = currentChannelInfo.memberCount
  // sessionStorage에서 메시지 복원 (채널별)
  const loadMessagesFromStorage = useCallback((channel: string): Message[] => {
    if (typeof window === "undefined") {
      // 채널별 기본 목업 메시지 반환
      return CHANNEL_MOCK_MESSAGES[channel] || MOCK_MESSAGES
    }
    
    // HR Policy Agent와 같은 특정 채널은 항상 기본 목업 메시지만 사용
    const alwaysUseMockChannels = ["hr-policy-agent", "anjenbot-safety-bot", "plai-maker"]
    if (alwaysUseMockChannels.includes(channel)) {
      return CHANNEL_MOCK_MESSAGES[channel] || []
    }
    
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${channel}`
      const stored = sessionStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as Message[]
        // 채널별 기본 목업 메시지와 병합 (초기 메시지 유지)
        const channelMockMessages = CHANNEL_MOCK_MESSAGES[channel] || MOCK_MESSAGES
        return [...channelMockMessages, ...parsed]
      }
    } catch (error) {
      console.error("Failed to load messages from storage:", error)
    }
    // 저장된 메시지가 없으면 채널별 기본 목업 메시지 반환
    return CHANNEL_MOCK_MESSAGES[channel] || MOCK_MESSAGES
  }, [])

  const [messages, setMessages] = useState<Message[]>(() => loadMessagesFromStorage(currentChannel))
  const chatAreaRef = useRef<HTMLDivElement>(null)

  // 완료된 작업 결과를 로딩 메시지에 적용
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const taskResultsStr = sessionStorage.getItem(TASK_RESULTS_KEY)
      if (!taskResultsStr) return

      const taskResults = JSON.parse(taskResultsStr) as Record<string, string>
      
      setMessages((prev) => {
        let updated = false
        const newMessages = prev.map((msg) => {
          // 로딩 중인 메시지이고, 해당 taskId의 결과가 있으면 교체
          if (msg.isLoading && msg.taskId && taskResults[msg.taskId]) {
            updated = true
            const result = taskResults[msg.taskId]
            
            // 에러 메시지인 경우
            if (result.startsWith("ERROR:")) {
              return {
                ...msg,
                isLoading: false,
                content: result.replace("ERROR:", ""),
                isBot: true,
                avatar: "/assets/anjenbot_avatar.png", // 안젠봇 아바타 유지
              }
            }
            // 정상 결과인 경우
            return {
              ...msg,
              isLoading: false,
              content: "MISO 워크플로우 결과",
              misoResult: result,
              avatar: "/assets/anjenbot_avatar.png", // 안젠봇 아바타 유지
            }
          }
          return msg
        })

        // 결과를 적용한 메시지가 있으면 상태 업데이트
        if (updated) {
          return newMessages
        }
        return prev
      })
    } catch (error) {
      console.error("Failed to load task results:", error)
    }
  }, []) // 마운트 시 한 번만 실행

  // 채널 변경 핸들러
  const handleChannelChange = useCallback((newChannel: string) => {
    // 현재 채널의 메시지를 저장
    if (typeof window !== "undefined") {
      try {
        const storageKey = `${STORAGE_KEY_PREFIX}${currentChannel}`
        // 현재 채널의 기본 목업 메시지 개수 확인
        const channelMockMessages = CHANNEL_MOCK_MESSAGES[currentChannel] || MOCK_MESSAGES
        const userMessages = messages.slice(channelMockMessages.length)
        sessionStorage.setItem(storageKey, JSON.stringify(userMessages))
      } catch (error) {
        console.error("Failed to save messages to storage:", error)
      }
    }
    
    // 새 채널로 전환
    setCurrentChannel(newChannel)
    const newMessages = loadMessagesFromStorage(newChannel)
    setMessages(newMessages)
  }, [currentChannel, messages, loadMessagesFromStorage])

  // 메시지가 변경될 때마다 sessionStorage에 저장 (채널별)
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // HR Policy Agent와 같은 특정 채널은 메시지를 저장하지 않음
    const alwaysUseMockChannels = ["hr-policy-agent", "anjenbot-safety-bot", "plai-maker"]
    if (alwaysUseMockChannels.includes(currentChannel)) {
      return
    }
    
    try {
      // 채널별 기본 목업 메시지를 제외한 사용자 메시지만 저장
      const storageKey = `${STORAGE_KEY_PREFIX}${currentChannel}`
      const channelMockMessages = CHANNEL_MOCK_MESSAGES[currentChannel] || MOCK_MESSAGES
      const userMessages = messages.slice(channelMockMessages.length)
      sessionStorage.setItem(storageKey, JSON.stringify(userMessages))
    } catch (error) {
      console.error("Failed to save messages to storage:", error)
    }
  }, [messages, currentChannel])

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
    (messageText: string, result?: string, taskId?: string) => {
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
        if (messageText.startsWith("/tbm") && taskId) {
          const loadingMessage: Message = {
            sender: "안젠봇",
            time: timeString,
            content: "답변을 준비하고 있습니다...",
            avatar: "/assets/anjenbot_avatar.png",
            isBot: true,
            isLoading: true,
            taskId,
          }
          setMessages((prev) => [...prev, loadingMessage])
        }
      }

      // MISO 결과가 있으면 해당 taskId의 로딩 메시지를 실제 결과로 교체
      if (result && taskId) {
        // 완료된 작업 결과를 sessionStorage에 저장 (나갔다가 들어왔을 때 복원용)
        try {
          const existingResults = sessionStorage.getItem(TASK_RESULTS_KEY)
          const taskResults = existingResults ? JSON.parse(existingResults) : {}
          taskResults[taskId] = result
          sessionStorage.setItem(TASK_RESULTS_KEY, JSON.stringify(taskResults))
        } catch (error) {
          console.error("Failed to save task result:", error)
        }

        setMessages((prev) => {
          return prev.map((msg) => {
            // 해당 taskId의 로딩 메시지를 결과 메시지로 교체
            if (msg.taskId === taskId && msg.isLoading) {
              // 에러 메시지인 경우
              if (result.startsWith("ERROR:")) {
                return {
                  ...msg,
                  isLoading: false,
                  content: result.replace("ERROR:", ""),
                  isBot: true,
                  avatar: "/assets/anjenbot_avatar.png", // 안젠봇 아바타 유지
                }
              }
              // 정상 결과인 경우
              return {
                ...msg,
                isLoading: false,
                content: "MISO 워크플로우 결과",
                misoResult: result,
                avatar: "/assets/anjenbot_avatar.png", // 안젠봇 아바타 유지
              }
            }
            return msg
          })
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
        <SlackSidebar 
          currentChannel={currentChannel}
          onChannelChange={handleChannelChange}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <ChannelHeader channelName={channelName} memberCount={memberCount} />

          <ChannelTabs currentChannel={currentChannel} />

          <div ref={chatAreaRef} className="flex-1 relative min-h-0">
            {messages.length === 0 && currentChannel === "일반" ? (
              <ChannelWelcome channelName={channelName} onChannelChange={handleChannelChange} />
            ) : (
            <MessagesList 
              messages={messages} 
              containerRef={chatAreaRef}
            />
            )}
          </div>

          <SlackInput onMessageSent={handleMessageSent} channelName={channelName} />
        </div>
      </div>
    </div>
  )
}

