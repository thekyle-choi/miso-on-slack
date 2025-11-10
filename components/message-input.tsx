"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MessageInputProps {
  onSend: (message: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-4"
      style={{
        borderColor: "var(--slack-border)",
        backgroundColor: "var(--slack-bg)",
      }}
    >
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="/plai-maker start [아이디어]를 입력하거나 메시지를 입력하세요..."
            className="w-full px-3 py-2 rounded border resize-none focus:outline-none focus:ring-2 focus:ring-[#007A5A]"
            style={{
              borderColor: "var(--slack-border)",
              backgroundColor: "var(--slack-bg)",
              color: "var(--slack-text)",
            }}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
        </div>
        <Button type="submit" className="bg-[#007A5A] hover:bg-[#006B4E] text-white border-0 px-6">
          전송
        </Button>
      </div>
      <div className="text-xs mt-2" style={{ color: "var(--slack-text-muted)" }}>
        Shift + Enter로 줄바꿈, Enter로 전송
      </div>
    </form>
  )
}
