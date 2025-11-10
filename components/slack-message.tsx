"use client"

import Image from "next/image"
import { MessageCircle, Smile, MoreHorizontal, RotateCcw, Loader2, FileText } from "lucide-react"
import { useMemo, useState } from "react"
import { MisoResultModal } from "@/components/miso-result-modal"

// 마크다운 콘텐츠 렌더링 컴포넌트
function MarkdownContent({ content }: { content: string }) {
  const renderedContent = useMemo(() => {
    const lines = content.split("\n")
    const result: string[] = []
    let inList = false
    let listItems: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        result.push(`<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`)
        listItems = []
        inList = false
      }
    }

    for (const line of lines) {
      // 제목 처리
      if (line.match(/^### /)) {
        flushList()
        result.push(`<h3 class="font-bold text-base mt-4 mb-2">${line.replace(/^### /, "")}</h3>`)
        continue
      }
      if (line.match(/^## /)) {
        flushList()
        result.push(`<h2 class="font-bold text-lg mt-5 mb-3">${line.replace(/^## /, "")}</h2>`)
        continue
      }
      if (line.match(/^# /)) {
        flushList()
        result.push(`<h1 class="font-bold text-xl mt-6 mb-4">${line.replace(/^# /, "")}</h1>`)
        continue
      }

      // 구분선 처리
      if (line.trim() === "---") {
        flushList()
        result.push('<hr class="my-4 border-gray-300" />')
        continue
      }

      // 체크박스 리스트 처리
      if (line.match(/^- \[ \] /)) {
        flushList()
        const text = line.replace(/^- \[ \] /, "")
        result.push(`<div class="ml-4 flex items-start gap-2 my-1"><span class="text-gray-400">☐</span><span>${text}</span></div>`)
        continue
      }
      if (line.match(/^- \[x\] /)) {
        flushList()
        const text = line.replace(/^- \[x\] /, "")
        result.push(`<div class="ml-4 flex items-start gap-2 my-1"><span class="text-gray-600">☑</span><span>${text}</span></div>`)
        continue
      }

      // 일반 리스트 처리
      if (line.match(/^- /)) {
        if (!inList) {
          inList = true
        }
        const text = line.replace(/^- /, "")
        listItems.push(`<li>${text}</li>`)
        continue
      }

      // 리스트가 끝나면 플러시
      if (inList && line.trim() === "") {
        flushList()
        continue
      }

      // 일반 텍스트
      flushList()
      if (line.trim()) {
        // 볼드 처리
        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        result.push(`<p class="my-1">${processedLine}</p>`)
      } else {
        result.push("<br />")
      }
    }

    flushList()
    return result.join("")
  }, [content])

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />
}

interface SlackMessageProps {
  sender: string
  time: string
  content: string
  avatar?: string
  reactions?: Array<{ emoji: string; count: number }>
  isBot?: boolean
  badge?: string
  isUpdate?: boolean
  event?: {
    title: string
    emoji: string
    time: string
  }
  attachment?: {
    type: string
    title: string
    subtitle: string
  }
  isLoading?: boolean
  misoResult?: string
  containerRef?: React.RefObject<HTMLElement>
}

export function SlackMessage({
  sender,
  time,
  content,
  avatar,
  reactions,
  isBot,
  badge,
  isUpdate,
  event,
  attachment,
  isLoading,
  misoResult,
  containerRef,
}: SlackMessageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {misoResult && (
        <MisoResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          result={misoResult}
          containerRef={containerRef}
        />
      )}
    <div className="flex gap-2.5 px-5 py-2 hover:bg-[#F8F8F8] group">
      <div className="shrink-0 mt-0.5">
        {isUpdate ? (
          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        ) : (
          <Image
            src={avatar || "/placeholder.svg"}
            alt={sender}
            width={36}
            height={36}
            className="rounded"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-bold text-[15px] text-gray-900 hover:underline cursor-pointer">{sender}</span>
          {isUpdate && (
            <span className="px-1 py-0.5 text-[11px] font-semibold text-gray-600 bg-gray-200 rounded">APP</span>
          )}
          <span className="text-[12px] text-gray-500">{time}</span>
        </div>

        <div className="text-[15px] text-gray-900 leading-[1.46668]">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-gray-600">{content}</span>
            </div>
          ) : misoResult ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-start gap-3 p-3 bg-white rounded border border-gray-300 max-w-md hover:border-gray-400 hover:shadow-sm cursor-pointer transition-all group/file"
            >
              <div className="shrink-0">
                <FileText className="w-6 h-6 text-[#1264A3]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900 group-hover/file:text-[#1264A3]">
                  MISO 워크플로우 결과
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  클릭하여 전체 내용 보기
                </div>
              </div>
            </button>
          ) : attachment?.type === "markdown" ? (
            <div className="prose prose-sm max-w-none">
              <MarkdownContent content={content} />
            </div>
          ) : (
            content.split(/(@[\w\s]+(?:\([^)]+\))?|\/[\w]+|📘)/g).map((part, idx) => {
              if (part.startsWith("@")) {
                return (
                  <span key={idx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                    {part}
                  </span>
                )
              } else if (part.startsWith("/") && /^\/[\w]+$/.test(part)) {
                // 슬래시 명령어를 멘션 스타일로 표시
                return (
                  <span key={idx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                    {part}
                  </span>
                )
              } else if (part === "📘") {
                return <span key={idx}>{part}</span>
              } else {
                return <span key={idx}>{part}</span>
              }
            })
          )}
        </div>

        {event && (
          <div className="mt-2 ml-3 pl-3 border-l-[3px] border-blue-600">
            <div className="flex items-center gap-2">
              <span className="text-base">{event.emoji}</span>
              <span className="text-[15px] font-medium text-blue-600 hover:underline cursor-pointer">{event.title}</span>
            </div>
            <div className="text-sm text-gray-700 mt-1">{event.time}</div>
          </div>
        )}

        {attachment && (
          <>
            <button className="mt-1 flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
              <span>Post</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="mt-2 flex items-start gap-2 p-3 bg-white rounded border border-gray-300 max-w-md hover:border-gray-400 cursor-pointer transition-colors">
              <svg className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">{attachment.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{attachment.subtitle}</div>
              </div>
            </div>
          </>
        )}

        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {reactions.map((reaction, idx) => (
              <button
                key={idx}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-gray-300 rounded-md hover:bg-[#E8F5FA] hover:border-[#1264A3] text-xs transition-colors"
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="text-[12px] text-gray-700 font-medium">{reaction.count}</span>
              </button>
            ))}
            <button className="opacity-0 group-hover:opacity-100 flex items-center px-1.5 py-0.5 border border-gray-300 bg-white rounded-md hover:bg-gray-50 transition-opacity">
              <Smile className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 flex items-start gap-0.5 pt-0.5">
        <button className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 hover:shadow-sm transition-all" title="Add reaction">
          <Smile className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 hover:shadow-sm transition-all" title="Reply in thread">
          <MessageCircle className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 hover:shadow-sm transition-all" title="Share message">
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 hover:shadow-sm transition-all" title="More actions">
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
    </>
  )
}
