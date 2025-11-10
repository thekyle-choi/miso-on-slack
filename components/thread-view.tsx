import { Avatar } from "@/components/ui/avatar"

interface ThreadMessage {
  userName: string
  content: string
  timestamp: string
}

interface ThreadViewProps {
  messages: ThreadMessage[]
}

export function ThreadView({ messages }: ThreadViewProps) {
  return (
    <div
      className="ml-14 mr-4 mb-2 border-l-2 pl-4"
      style={{ borderColor: "var(--slack-border)", backgroundColor: "var(--slack-thread-bg)" }}
    >
      <div className="py-2 space-y-3">
        {messages.map((message, idx) => (
          <div key={idx} className="flex gap-2">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full bg-[#1264A3] flex items-center justify-center text-white font-bold text-xs">
                {message.userName.charAt(0)}
              </div>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm" style={{ color: "var(--slack-text)" }}>
                  {message.userName}
                </span>
                <span className="text-xs" style={{ color: "var(--slack-text-muted)" }}>
                  {message.timestamp}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--slack-text)" }}>
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
