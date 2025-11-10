import { Avatar } from "@/components/ui/avatar"

interface UserMessageProps {
  content: string
  timestamp: string
  userName?: string
}

export function UserMessage({ content, timestamp, userName = "You" }: UserMessageProps) {
  return (
    <div className="flex gap-2 px-4 py-2 hover:bg-[#F8F9FA] group justify-end">
      <div className="flex flex-col items-end max-w-[70%]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs" style={{ color: "var(--slack-text-muted)" }}>
            {timestamp}
          </span>
          <span className="font-bold text-sm" style={{ color: "var(--slack-text)" }}>
            {userName}
          </span>
        </div>
        <div className="rounded-lg px-3 py-2 bg-[#DEEBFF]" style={{ color: "var(--slack-text)" }}>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
      </div>
      <Avatar className="w-9 h-9 flex-shrink-0">
        <div className="w-full h-full bg-[#1264A3] flex items-center justify-center text-white font-bold text-sm">
          {userName.charAt(0)}
        </div>
      </Avatar>
    </div>
  )
}
