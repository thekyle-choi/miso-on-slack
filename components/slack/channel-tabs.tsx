"use client"

import { MessageCircle, FileText, Plus } from "lucide-react"

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  isActive?: boolean
}

interface ChannelTabsProps {
  tabs?: Tab[]
  onTabClick?: (tabId: string) => void
}

const DEFAULT_TABS: Tab[] = [
  {
    id: "messages",
    label: "메시지",
    icon: <MessageCircle className="w-4 h-4" />,
    isActive: true,
  },
  {
    id: "gs-holding",
    label: "GS Holding - Salesforce",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "miso-usecase",
    label: "MISO Usecase",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "slack-basics",
    label: "Slack 기초",
    icon: <FileText className="w-4 h-4" />,
  },
]

export function ChannelTabs({ tabs = DEFAULT_TABS, onTabClick }: ChannelTabsProps) {
  return (
    <div className="flex items-center gap-0 px-4 py-0 border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick?.(tab.id)}
          className={`
            relative flex items-center gap-1.5 px-3 py-2 text-[13px] transition-colors
            ${
              tab.isActive
                ? "text-gray-900 font-bold"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1164A3]" />
          )}
        </button>
      ))}
      <button
        className="flex items-center px-2.5 py-2 text-gray-500 hover:text-gray-900 transition-colors"
        aria-label="Add tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

