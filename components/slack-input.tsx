"use client"

import { useState, useCallback, KeyboardEvent, useMemo, useRef } from "react"
import { Bold, Italic, Underline, Strikethrough, Link2, List, ListOrdered, Code, Plus, Type, Smile, AtSign, Video, Mic, Zap, ChevronDown, Send, X, Loader2 } from "lucide-react"
import { SlackCommandDropdown } from "./slack-command-dropdown"
import { type SlackCommand, SLACK_COMMANDS } from "@/constants/slack-commands"

type SlackInputProps = {
  onMessageSent?: (message: string, result?: string) => void
}

export function SlackInput({ onMessageSent }: SlackInputProps) {
  const [message, setMessage] = useState("")
  const [showCommandDropdown, setShowCommandDropdown] = useState(false)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const [commandFilterText, setCommandFilterText] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false) // 한글 입력 조합 중인지 체크
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 필터링된 명령어 목록 계산
  const filteredCommands = useMemo(() => {
    if (!commandFilterText) return SLACK_COMMANDS
    return SLACK_COMMANDS.filter((cmd) => {
      return (
        cmd.title.toLowerCase().includes(commandFilterText.toLowerCase()) ||
        cmd.action.toLowerCase().includes(commandFilterText.toLowerCase())
      )
    })
  }, [commandFilterText])

  // 메시지 변경 핸들러 - "/" 입력 감지
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // /tbm 명령어가 이미 선택되고 띄어쓰기 후 내용이 입력 중인 경우 드롭다운 차단
    // 하지만 /tbm 이후의 내용이 지워지고 새로운 /로 시작하면 드롭다운 표시
    const tbmPattern = /^\/tbm\s+\S/
    if (tbmPattern.test(value)) {
      setShowCommandDropdown(false)
      setCommandFilterText("")
      return
    }

    // "/" 로 시작하는지 확인
    if (value.startsWith("/")) {
      const filterText = value.slice(1) // "/" 제거
      setCommandFilterText(filterText)
      setShowCommandDropdown(true)
      setSelectedCommandIndex(0)
    } else {
      setShowCommandDropdown(false)
      setCommandFilterText("")
    }
  }, [])

  // 명령어 선택 핸들러
  const handleSelectCommand = useCallback((command: SlackCommand) => {
    setMessage(command.action + " ")
    setShowCommandDropdown(false)
    setCommandFilterText("")
    setSelectedCommandIndex(0)
  }, [])

  // 드롭다운 닫기 핸들러
  const handleCloseDropdown = useCallback(() => {
    setShowCommandDropdown(false)
    setCommandFilterText("")
    setSelectedCommandIndex(0)
  }, [])

  // 이미지 제거 핸들러
  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  // MISO API 호출 함수
  const callMisoWorkflow = useCallback(async (query: string, imageFile?: File) => {
    setIsLoading(true)
    setError(null)

    try {
      let uploadFileId: string | undefined

      // 이미지가 있으면 먼저 업로드
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)
        uploadFormData.append("user", "slack_user")

        const uploadResponse = await fetch("/api/miso/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json()
          throw new Error(uploadError.detail || uploadError.error || "이미지 업로드에 실패했습니다.")
        }

        const uploadResult = await uploadResponse.json()
        uploadFileId = uploadResult.id
      }

      // 워크플로우 실행
      const workflowResponse = await fetch("/api/miso/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          image: uploadFileId
            ? {
                upload_file_id: uploadFileId,
              }
            : null,
          mode: "blocking",
        }),
      })

      if (!workflowResponse.ok) {
        const workflowError = await workflowResponse.json()
        throw new Error(workflowError.detail || workflowError.error || "워크플로우 실행에 실패했습니다.")
      }

      const workflowResult = await workflowResponse.json()
      const result = workflowResult.data?.outputs?.result || workflowResult.outputs?.result

      if (!result) {
        throw new Error("결과를 받을 수 없습니다.")
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return

    const trimmedMessage = message.trim()

    // /tbm 명령어 처리
    if (trimmedMessage.startsWith("/tbm")) {
      const query = trimmedMessage.slice(4).trim() // "/tbm" 제거

      if (!query) {
        setError("요청사항을 입력해주세요. 예: /tbm 밀폐공간에서 작업을 위한 수칙")
        return
      }

      try {
        // 메시지 전송 콜백 호출 (로딩 상태로 시작)
        if (onMessageSent) {
          onMessageSent(trimmedMessage) // 먼저 사용자 메시지 전송
        }

        // 입력 필드 먼저 초기화
        setMessage("")
        // textarea ref를 사용하여 직접 초기화
        if (textareaRef.current) {
          textareaRef.current.value = ""
        }
        handleRemoveImage()
        setError(null)

        const result = await callMisoWorkflow(query, selectedImage || undefined)

        // 결과를 다시 콜백으로 전달
        if (onMessageSent) {
          onMessageSent("", result) // 빈 문자열과 함께 결과 전달
        }
      } catch (err) {
        // 에러는 이미 callMisoWorkflow에서 설정됨
        console.error("MISO 워크플로우 실행 실패:", err)
      }
    } else {
      // 일반 메시지 전송
      if (onMessageSent) {
        onMessageSent(trimmedMessage)
      }
      setMessage("")
      // textarea ref를 사용하여 직접 초기화
      if (textareaRef.current) {
        textareaRef.current.value = ""
      }
      handleRemoveImage()
      setError(null)
    }
  }, [message, isLoading, selectedImage, callMisoWorkflow, onMessageSent, handleRemoveImage])

  // 키보드 네비게이션 핸들러
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // 한글 입력 중(composition 중)일 때는 Enter 처리 방지
      if (e.key === "Enter" && isComposing) {
        return
      }

      if (showCommandDropdown) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedCommandIndex((prev) => {
            const maxIndex = filteredCommands.length - 1
            return prev < maxIndex ? prev + 1 : 0
          })
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedCommandIndex((prev) => {
            const maxIndex = filteredCommands.length - 1
            return prev > 0 ? prev - 1 : maxIndex
          })
        } else if (e.key === "Escape") {
          e.preventDefault()
          handleCloseDropdown()
        } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          // 현재 선택된 명령어를 가져와서 실행
          const selectedCommand = filteredCommands[selectedCommandIndex]
          if (selectedCommand) {
            handleSelectCommand(selectedCommand)
          }
        }
      } else if (e.key === "Enter" && !e.shiftKey && !isLoading) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [showCommandDropdown, filteredCommands, selectedCommandIndex, handleCloseDropdown, handleSelectCommand, isLoading, handleSendMessage, isComposing]
  )

  // 이미지 파일 선택 핸들러
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 첨부할 수 있습니다.")
      return
    }

    // 파일 크기 제한 (예: 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setError("파일 크기는 10MB를 초과할 수 없습니다.")
      return
    }

    setSelectedImage(file)
    setError(null)

    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* External Users Notice */}
      <div className="px-5 py-3 bg-[#FDF6E3] border-b border-[#F5E6C8] flex items-center gap-2">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-[#1868DB]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.5 2.25h9a5.25 5.25 0 110 10.5h-9a5.25 5.25 0 110-10.5z"/>
            <path d="M7.5 21.75h9a5.25 5.25 0 100-10.5h-9a5.25 5.25 0 100 10.5z"/>
          </svg>
        </div>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">9명의 외부 사용자</span>가 <span className="font-semibold">Salesforce 팀</span>에 속해 있습니다
        </p>
      </div>

      {/* Input Container */}
      <div className="px-5 py-4 relative">
        {/* Slash Command Dropdown */}
        <SlackCommandDropdown
          isOpen={showCommandDropdown}
          onSelect={handleSelectCommand}
          onClose={handleCloseDropdown}
          selectedIndex={selectedCommandIndex}
          filterText={commandFilterText}
        />

        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#1164A3] focus-within:shadow-[0_0_0_1px_#1164A3]">
          {/* Top Formatting Toolbar */}
          <div className="flex items-center gap-px px-2 py-1.5 border-b border-gray-200 bg-gray-50">
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Underline">
              <Underline className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Strikethrough">
              <Strikethrough className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Link">
              <Link2 className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Bulleted list">
              <List className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Numbered list">
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Blockquote">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Code">
              <Code className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-gray-900" title="Code block">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={2}/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l2 2-2 2M12 13h4" />
              </svg>
            </button>
          </div>

          {/* Text Input Area */}
          <div className="relative bg-white">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="#gs-holdings-52g-salesforce-slack에 메시지 보내기"
              className="w-full px-3 py-3 text-[15px] resize-none focus:outline-none min-h-[80px] placeholder:text-gray-500"
              rows={3}
            />
          </div>

          {/* 이미지 미리보기 */}
          {imagePreview && selectedImage && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="relative w-16 h-16 rounded border border-gray-300 overflow-hidden bg-white">
                  <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate">{selectedImage.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedImage.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900"
                  title="이미지 제거"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="px-3 py-2 border-t border-gray-200 bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Bottom Action Toolbar */}
          <div className="flex items-center justify-between px-2 py-2 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-px">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                title="이미지 첨부"
                disabled={isLoading}
              >
                <Plus className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="Format">
                <Type className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="Emoji">
                <Smile className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="Mention">
                <AtSign className="w-[18px] h-[18px]" />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="Video">
                <Video className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="Voice">
                <Mic className="w-[18px] h-[18px]" />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-0.5"></div>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="Shortcuts">
                <Zap className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleSendMessage}
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!message.trim() || isLoading}
                title="Send"
              >
                {isLoading ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  <Send className="w-[18px] h-[18px]" />
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900" title="More options">
                <ChevronDown className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
