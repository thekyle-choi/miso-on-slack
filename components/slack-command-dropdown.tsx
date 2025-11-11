"use client"

import { useEffect, useRef } from "react"
import { SLACK_COMMANDS, type SlackCommand } from "@/constants/slack-commands"

type SlackCommandDropdownProps = {
  isOpen: boolean
  onSelect: (command: SlackCommand) => void
  onClose: () => void
  selectedIndex: number
  filterText?: string
}

export function SlackCommandDropdown({
  isOpen,
  onSelect,
  onClose,
  selectedIndex,
  filterText = "",
}: SlackCommandDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 필터링된 명령어 목록
  const filteredCommands = SLACK_COMMANDS.filter((cmd) => {
    if (!filterText) return true
    return (
      cmd.title.toLowerCase().includes(filterText.toLowerCase()) ||
      cmd.action.toLowerCase().includes(filterText.toLowerCase())
    )
  })

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  // 선택된 항목이 보이도록 스크롤
  useEffect(() => {
    if (!dropdownRef.current) return
    const selectedElement = dropdownRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-5 mb-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-[400px] overflow-y-auto z-50 w-[320px]"
    >
      {filteredCommands.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-500">일치하는 명령어가 없습니다</div>
      ) : (
        <div className="py-1.5">
          {filteredCommands.map((command, index) => (
            <button
              key={command.id}
              data-index={index}
              onClick={() => onSelect(command)}
              className={`w-full flex items-center gap-3 px-3 py-2 transition-colors ${
                index === selectedIndex ? "bg-[#1164A3] text-white" : "text-gray-900 hover:bg-[#1164A3] hover:text-white"
              }`}
            >
              {/* 아이콘 */}
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded bg-white overflow-hidden">
                {command.icon === "slack" ? (
                  <svg className="w-5 h-5" viewBox="0 0 54 54" fill="none">
                    <path d="M11.3 24.3c0 2.6-2.1 4.6-4.6 4.6S2 26.9 2 24.3s2.1-4.6 4.6-4.6h4.6v4.6zm2.3 0c0-2.6 2.1-4.6 4.6-4.6s4.6 2.1 4.6 4.6v11.5c0 2.6-2.1 4.6-4.6 4.6s-4.6-2.1-4.6-4.6V24.3z" fill="#E01E5A"/>
                    <path d="M18.2 11.3c-2.6 0-4.6-2.1-4.6-4.6S15.7 2 18.2 2s4.6 2.1 4.6 4.6v4.6h-4.6zm0 2.3c2.6 0 4.6 2.1 4.6 4.6s-2.1 4.6-4.6 4.6H6.7c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6h11.5z" fill="#36C5F0"/>
                    <path d="M42.7 18.2c0-2.6 2.1-4.6 4.6-4.6s4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6h-4.6v-4.6zm-2.3 0c0 2.6-2.1 4.6-4.6 4.6s-4.6-2.1-4.6-4.6V6.7c0-2.6 2.1-4.6 4.6-4.6s4.6 2.1 4.6 4.6v11.5z" fill="#2EB67D"/>
                    <path d="M35.8 42.7c2.6 0 4.6 2.1 4.6 4.6s-2.1 4.6-4.6 4.6-4.6-2.1-4.6-4.6v-4.6h4.6zm0-2.3c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6h11.5c2.6 0 4.6 2.1 4.6 4.6s-2.1 4.6-4.6 4.6H35.8z" fill="#ECB22E"/>
                  </svg>
                ) : command.icon.startsWith("http") || command.icon.startsWith("/") ? (
                  <img src={command.icon} alt="" className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="text-xl">{command.icon}</span>
                )}
              </div>

              {/* 텍스트 정보 */}
              <div className="flex-1 text-left">
                <div className="font-medium text-[14px]">{command.title}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    index === selectedIndex ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {command.appName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

