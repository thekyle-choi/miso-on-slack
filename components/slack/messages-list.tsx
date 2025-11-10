"use client"

import { useRef, useEffect } from "react"
import { SlackMessage } from "@/components/slack-message"
import type { Message } from "@/constants/messages"

interface MessagesListProps {
  messages: Message[]
  externalCount?: number
  teamName?: string
}

export function MessagesList({ 
  messages, 
  externalCount = 9, 
  teamName = "Salesforce team" 
}: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="absolute inset-0 overflow-y-auto bg-white">
      {messages.map((message, idx) => (
        <SlackMessage
          key={idx}
          sender={message.sender}
          time={message.time}
          content={message.content}
          avatar={message.avatar}
          reactions={message.reactions}
          isBot={message.isBot}
          badge={message.badge}
          isUpdate={message.isUpdate}
          event={message.event}
          attachment={message.attachment}
          isLoading={message.isLoading}
          misoResult={message.misoResult}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

