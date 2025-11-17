"use client"

import Image from "next/image"
import { MessageCircle, Smile, MoreHorizontal, RotateCcw, FileText, Search, Paperclip } from "lucide-react"
import { useState, useMemo } from "react"
import { MisoResultModal } from "@/components/miso-result-modal"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { MessageFileAttachment } from "@/constants/messages"

// XML 태그 제거 함수
function removeXmlTags(content: string): string {
  // <tools> </tools> 태그 제거 (대소문자 구분 없이)
  return content.replace(/<tools>[\s\S]*?<\/tools>/gi, "").trim()
}

// 도구 호출 파싱 및 렌더링 함수
function parseToolCalls(content: string): Array<{ type: "text" | "tool"; content: string; toolData?: Record<string, unknown> }> {
  // XML 태그 제거
  const cleanedContent = removeXmlTags(content)
  const parts: Array<{ type: "text" | "tool"; content: string; toolData?: Record<string, unknown> }> = []
  const toolCallPattern = /\{[\s]*"query"[\s]*:[\s]*"([^"]+)"[\s]*\}/g
  
  let lastIndex = 0
  let match
  
  while ((match = toolCallPattern.exec(cleanedContent)) !== null) {
    // 도구 호출 이전의 텍스트
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: cleanedContent.slice(lastIndex, match.index) })
    }
    
    // 도구 호출 파싱
    try {
      const toolJson = match[0]
      const toolData = JSON.parse(toolJson) as Record<string, unknown>
      const query = toolData.query as string
      parts.push({ type: "tool", content: query, toolData })
    } catch {
      // 파싱 실패 시 일반 텍스트로 처리
      parts.push({ type: "text", content: match[0] })
    }
    
    lastIndex = match.index + match[0].length
  }
  
  // 마지막 도구 호출 이후의 텍스트
  if (lastIndex < cleanedContent.length) {
    parts.push({ type: "text", content: cleanedContent.slice(lastIndex) })
  }
  
  // 매칭이 없으면 전체를 텍스트로 반환
  if (parts.length === 0) {
    parts.push({ type: "text", content: cleanedContent })
  }
  
  return parts
}

// 마크다운 콘텐츠 렌더링 컴포넌트
function MarkdownContent({ content }: { content: string }) {
  const parsedContent = useMemo(() => parseToolCalls(content), [content])
  
  return (
    <div className="markdown-content leading-[1.15]">
      {parsedContent.map((part, idx) => {
        if (part.type === "tool") {
          // 도구 호출 UI 렌더링
          return (
            <div key={idx} className="my-1.5 flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-200 rounded-md">
              <Search className="w-4 h-4 text-gray-600 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-gray-500">Searching internal data</span>
                <span className="text-sm text-gray-900">{part.content}</span>
              </div>
            </div>
          )
        }
        
        // 일반 텍스트는 마크다운으로 렌더링
        return (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[remarkGfm]}
            components={{
              // 제목 스타일링 (컴팩트하게)
              h1: ({ children }) => <h1 className="font-bold text-xl mt-3 mb-2 leading-tight">{children}</h1>,
              h2: ({ children }) => <h2 className="font-bold text-lg mt-2.5 mb-1.5 leading-tight">{children}</h2>,
              h3: ({ children }) => <h3 className="font-bold text-base mt-2 mb-1 leading-tight">{children}</h3>,
              h4: ({ children }) => <h4 className="font-bold text-sm mt-1.5 mb-1 leading-tight">{children}</h4>,
              h5: ({ children }) => <h5 className="font-bold text-sm mt-1.5 mb-1 leading-tight">{children}</h5>,
              h6: ({ children }) => <h6 className="font-bold text-sm mt-1.5 mb-1 leading-tight">{children}</h6>,
              // 단락 스타일링 (행간 좁게)
              p: ({ children }) => <p className="my-0 leading-[1.15]">{children}</p>,
              // 리스트 스타일링 (간격 좁게)
              ul: ({ children }) => <ul className="list-disc ml-5 my-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-5 my-1">{children}</ol>,
              li: ({ children }) => <li className="leading-[1.1] my-0">{children}</li>,
              // 볼드 스타일링
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              // 이탤릭
              em: ({ children }) => <em className="italic">{children}</em>,
              // 링크
              a: ({ href, children }) => (
                <a href={href} className="text-[#1264A3] hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              // 테이블 스타일링 (컴팩트하게)
              table: ({ children }) => (
                <div className="my-2 overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
              th: ({ children }) => (
                <th className="border border-gray-300 px-2 py-1 bg-gray-50 font-semibold text-left text-xs">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-2 py-1 text-xs leading-[1.15]">
                  {children}
                </td>
              ),
              // 구분선 (간격 좁게)
              hr: () => <hr className="my-2 border-gray-300" />,
              // 코드 블록 (컴팩트하게)
              code: ({ className, children }) => {
                const isInline = !className
                return isInline ? (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono leading-[1.15]">{children}</code>
                ) : (
                  <code className={className}>{children}</code>
                )
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-2 rounded my-1.5 overflow-x-auto text-xs leading-[1.15]">
                  {children}
                </pre>
              ),
              // 블록쿼트
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-3 my-1.5 text-gray-700 italic">
                  {children}
                </blockquote>
              ),
            }}
          >
            {part.content}
          </ReactMarkdown>
        )
      })}
    </div>
  )
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
  files?: MessageFileAttachment[]
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
  files,
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

        <div className="text-[15px] text-gray-900 leading-[1.46668] whitespace-pre-wrap">
          {isLoading ? (
            (() => {
              const LOADING_TEXT = "Preparing response..."
              const trimmed = content.trim()
              const isInitialLoading = !trimmed || trimmed === LOADING_TEXT

              if (isInitialLoading) {
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex w-4 h-4 rounded-full border-2 border-gray-200 border-t-[#1264A3] animate-spin"
                      aria-hidden="true"
                    />
                    <span className="text-gray-600 whitespace-pre-wrap">{trimmed || LOADING_TEXT}</span>
                  </div>
                )
              }

              return attachment?.type === "markdown" ? (
                <MarkdownContent content={content} />
              ) : (
                (() => {
                  // 멘션 패턴: @이름(역할) 또는 @이름 형식 (한글, 영문, 숫자 포함)
                  const mentionPattern = /(@[가-힣\w]+(?:\([가-힣\w]+\))?)/g
                  const parts: Array<{ text: string; isMention: boolean }> = []
                  let lastIndex = 0
                  let match

                  while ((match = mentionPattern.exec(content)) !== null) {
                    // 멘션 이전의 일반 텍스트
                    if (match.index > lastIndex) {
                      parts.push({ text: content.slice(lastIndex, match.index), isMention: false })
                    }
                    // 멘션
                    parts.push({ text: match[0], isMention: true })
                    lastIndex = mentionPattern.lastIndex
                  }

                  // 마지막 멘션 이후의 일반 텍스트
                  if (lastIndex < content.length) {
                    parts.push({ text: content.slice(lastIndex), isMention: false })
                  }

                  // 빈 문자열이 아닌 경우에만 처리
                  if (parts.length === 0) {
                    parts.push({ text: content, isMention: false })
                  }

                  return parts.map((part, idx) => {
                    if (part.isMention) {
                      return (
                        <span key={idx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                          {part.text}
                        </span>
                      )
                    } else {
                      // 일반 텍스트 내에서 볼드, 슬래시 명령어, 이모지 처리
                      return (
                        <span key={idx}>
                          {part.text.split(/(\*\*[^*]+\*\*|\/[\w]+|📘)/g).map((subPart, subIdx) => {
                            // 볼드 마크다운 처리: **텍스트**
                            if (subPart.startsWith("**") && subPart.endsWith("**") && subPart.length > 4) {
                              const boldText = subPart.slice(2, -2)
                              return (
                                <strong key={subIdx} className="font-semibold">
                                  {boldText}
                                </strong>
                              )
                            }
                            // 슬래시 명령어 처리
                            if (subPart.startsWith("/") && /^\/[\w]+$/.test(subPart)) {
                              return (
                                <span key={subIdx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                                  {subPart}
                                </span>
                              )
                            }
                            return <span key={subIdx}>{subPart}</span>
                          })}
                        </span>
                      )
                    }
                  })
                })()
              )
            })()
          ) : misoResult ? (
            // 스트리밍 중: 로딩 스피너 없이 텍스트만 표시
            attachment?.type === "markdown" ? (
              <MarkdownContent content={content} />
            ) : (
              (() => {
                // 멘션 패턴: @이름(역할) 또는 @이름 형식 (한글, 영문, 숫자 포함)
                const mentionPattern = /(@[가-힣\w]+(?:\([가-힣\w]+\))?)/g
                const parts: Array<{ text: string; isMention: boolean }> = []
                let lastIndex = 0
                let match

                while ((match = mentionPattern.exec(content)) !== null) {
                  // 멘션 이전의 일반 텍스트
                  if (match.index > lastIndex) {
                    parts.push({ text: content.slice(lastIndex, match.index), isMention: false })
                  }
                  // 멘션
                  parts.push({ text: match[0], isMention: true })
                  lastIndex = mentionPattern.lastIndex
                }

                // 마지막 멘션 이후의 일반 텍스트
                if (lastIndex < content.length) {
                  parts.push({ text: content.slice(lastIndex), isMention: false })
                }

                // 빈 문자열이 아닌 경우에만 처리
                if (parts.length === 0) {
                  parts.push({ text: content, isMention: false })
                }

                return parts.map((part, idx) => {
                  if (part.isMention) {
                  return (
                    <span key={idx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                        {part.text}
                    </span>
                  )
                  } else {
                    // 일반 텍스트 내에서 볼드, 슬래시 명령어, 이모지 처리
                    return (
                      <span key={idx}>
                        {part.text.split(/(\*\*[^*]+\*\*|\/[\w]+|📘)/g).map((subPart, subIdx) => {
                          // 볼드 마크다운 처리: **텍스트**
                          if (subPart.startsWith("**") && subPart.endsWith("**") && subPart.length > 4) {
                            const boldText = subPart.slice(2, -2)
                            return (
                              <strong key={subIdx} className="font-semibold">
                                {boldText}
                              </strong>
                            )
                          }
                          // 슬래시 명령어 처리
                          if (subPart.startsWith("/") && /^\/[\w]+$/.test(subPart)) {
                  return (
                              <span key={subIdx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                                {subPart}
                              </span>
                            )
                          }
                          return <span key={subIdx}>{subPart}</span>
                        })}
                    </span>
                  )
                }
              })
              })()
            )
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
            <MarkdownContent content={content} />
          ) : (
            (() => {
              // 멘션 패턴: @이름(역할) 또는 @이름 형식 (한글, 영문, 숫자 포함)
              const mentionPattern = /(@[가-힣\w]+(?:\([가-힣\w]+\))?)/g
              const parts: Array<{ text: string; isMention: boolean }> = []
              let lastIndex = 0
              let match

              while ((match = mentionPattern.exec(content)) !== null) {
                // 멘션 이전의 일반 텍스트
                if (match.index > lastIndex) {
                  parts.push({ text: content.slice(lastIndex, match.index), isMention: false })
                }
                // 멘션
                parts.push({ text: match[0], isMention: true })
                lastIndex = mentionPattern.lastIndex
              }

              // 마지막 멘션 이후의 일반 텍스트
              if (lastIndex < content.length) {
                parts.push({ text: content.slice(lastIndex), isMention: false })
              }

              // 빈 문자열이 아닌 경우에만 처리
              if (parts.length === 0) {
                parts.push({ text: content, isMention: false })
              }

              return parts.map((part, idx) => {
                if (part.isMention) {
                return (
                  <span key={idx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                      {part.text}
                  </span>
                )
                } else {
                  // 일반 텍스트 내에서 볼드, 슬래시 명령어, 이모지 처리
                  return (
                    <span key={idx}>
                      {part.text.split(/(\*\*[^*]+\*\*|\/[\w]+|📘)/g).map((subPart, subIdx) => {
                        // 볼드 마크다운 처리: **텍스트**
                        if (subPart.startsWith("**") && subPart.endsWith("**") && subPart.length > 4) {
                          const boldText = subPart.slice(2, -2)
                          return (
                            <strong key={subIdx} className="font-semibold">
                              {boldText}
                            </strong>
                          )
                        }
                        // 슬래시 명령어 처리
                        if (subPart.startsWith("/") && /^\/[\w]+$/.test(subPart)) {
                return (
                            <span key={subIdx} className="text-[#1264A3] font-medium bg-[#E8F5FA] hover:bg-[#D8EDF5] px-0.5 rounded cursor-pointer">
                              {subPart}
                            </span>
                          )
                        }
                        return <span key={subIdx}>{subPart}</span>
                      })}
                  </span>
                )
              }
            })
            })()
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

        {files && files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {files.map((file) =>
              file.type === "image" ? (
                <div
                  key={file.id}
                  className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200 shadow-sm"
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                    {file.name}
                  </div>
                </div>
              ) : (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <div className="flex flex-col">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">{file.sizeLabel}</span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {attachment && attachment.type !== "markdown" && !isLoading && (
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
