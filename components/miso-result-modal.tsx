"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useMemo } from "react"
import { X, ExternalLink } from "lucide-react"

interface MisoResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: string
}

// 마크다운 콘텐츠 렌더링 함수
function renderMarkdown(content: string) {
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
}

export function MisoResultModal({ isOpen, onClose, result }: MisoResultModalProps) {
  const renderedContent = useMemo(() => renderMarkdown(result), [result])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Slack 스타일 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-[#611F69] rounded">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">MISO 워크플로우 결과</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              title="새 창에서 열기"
            >
              <ExternalLink className="w-4 h-4" />
              <span>새 창에서 열기</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 문서 내용 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-12 py-8">
            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

