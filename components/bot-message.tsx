"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface BotMessageProps {
  agent: "ally" | "kyle" | "heather" | "ian"
  content: string
  timestamp: string
  buttons?: Array<{ label: string; variant?: "primary" | "secondary"; onClick?: () => void }>
  showThread?: boolean
  threadCount?: number
  onThreadClick?: () => void
}

const agentColors = {
  ally: "#E3F2FD",
  kyle: "#F3E5F5",
  heather: "#FFF3E0",
  ian: "#E8F5E9",
}

export function BotMessage({
  agent,
  content,
  timestamp,
  buttons,
  showThread,
  threadCount,
  onThreadClick,
}: BotMessageProps) {
  return (
    <div className="flex gap-2 px-4 py-2 hover:bg-[#F8F9FA] group">
      <Avatar className="w-9 h-9 flex-shrink-0">
        <div className="w-full h-full bg-[#007A5A] flex items-center justify-center text-white font-bold text-sm">
          P
        </div>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-sm" style={{ color: "var(--slack-text)" }}>
            PLAI MAKER
          </span>
          <span className="text-xs" style={{ color: "var(--slack-text-muted)" }}>
            {timestamp}
          </span>
        </div>

        <div className="mb-2">
          <div
            className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2"
            style={{
              backgroundColor: agentColors[agent],
              color: "var(--slack-text)",
            }}
          >
            {`<${agent}>`}
          </div>
          <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--slack-text)" }}>
            {content}
          </p>
        </div>

        {buttons && buttons.length > 0 && (
          <div className="flex gap-2 mb-2">
            {buttons.map((button, idx) => (
              <Button
                key={idx}
                onClick={button.onClick}
                size="sm"
                variant={button.variant === "primary" ? "default" : "outline"}
                className={
                  button.variant === "primary"
                    ? "bg-[#007A5A] hover:bg-[#006B4E] text-white border-0"
                    : "border-[#E1E1E1] hover:bg-[#F8F9FA]"
                }
                style={button.variant === "secondary" ? { color: "var(--slack-text)" } : {}}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}

        {showThread && threadCount && threadCount > 0 && (
          <button
            onClick={onThreadClick}
            className="flex items-center gap-1 text-sm hover:underline"
            style={{ color: "var(--slack-link)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            {threadCount} {threadCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>
    </div>
  )
}
