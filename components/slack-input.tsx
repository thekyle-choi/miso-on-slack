"use client"

import { useState, useCallback, KeyboardEvent, useMemo, useRef, useEffect } from "react"
import { Bold, Italic, Underline, Strikethrough, Link2, List, ListOrdered, Code, Plus, Type, Smile, AtSign, Video, Mic, Zap, ChevronDown, Send, X, Paperclip, Image as ImageIcon, FolderOpen } from "lucide-react"
import { SlackCommandDropdown } from "./slack-command-dropdown"
import { SampleImagesModal } from "./sample-images-modal"
import { ImageViewerModal } from "./image-viewer-modal"
import { type SlackCommand, SLACK_COMMANDS } from "@/constants/slack-commands"
import type { DesktopAsset } from "@/constants/desktop-assets"
import type { MessageFileAttachment } from "@/constants/messages"
import type { SlackSendMessagePayload } from "@/types/slack"

const extractTextFromSsePayload = (payload: unknown): string => {
  if (payload === null || payload === undefined) {
    return ""
  }

  if (typeof payload === "string") {
    return payload
  }

  if (typeof payload === "number" || typeof payload === "boolean") {
    return String(payload)
  }

  if (Array.isArray(payload)) {
    return payload.map(extractTextFromSsePayload).join("")
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>

    if (typeof obj.text === "string") {
      return obj.text
    }

    if (Array.isArray(obj.text)) {
      const text = obj.text.map(extractTextFromSsePayload).join("")
      if (text) {
        return text
      }
    }

    if (typeof obj.content === "string") {
      return obj.content
    }

    if (Array.isArray(obj.content)) {
      const content = obj.content.map(extractTextFromSsePayload).join("")
      if (content) {
        return content
      }
    }

    if (typeof obj.delta === "string") {
      return obj.delta
    }

    if (Array.isArray(obj.delta)) {
      const delta = obj.delta.map(extractTextFromSsePayload).join("")
      if (delta) {
        return delta
      }
    }

    if (obj.data) {
      const dataText = extractTextFromSsePayload(obj.data)
      if (dataText) {
        return dataText
      }
    }

    if (obj.answer) {
      const answerText = extractTextFromSsePayload(obj.answer)
      if (answerText) {
        return answerText
      }
    }

    if (obj.message) {
      const messageText = extractTextFromSsePayload(obj.message)
      if (messageText) {
        return messageText
      }
    }

    if (obj.value) {
      const valueText = extractTextFromSsePayload(obj.value)
      if (valueText) {
        return valueText
      }
    }
  }

  return ""
}

type SlackInputProps = {
  onMessageSent?: (payload: SlackSendMessagePayload) => void
  channelName?: string
  onStreamingUpdate?: (taskId: string, content: string) => void
  externalAttachments?: DesktopAsset[]
  onExternalAttachmentsConsumed?: (assetIds: string[]) => void
}

type AttachmentState = {
  id: string
  name: string
  type: "image" | "document"
  mimeType: string
  sizeLabel: string
  file: File
  previewUrl: string
  source: "upload" | "finder" | "photos"
  originId?: string
}

const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exp
  return `${value.toFixed(value >= 10 || exp === 0 ? 0 : 1)} ${units[exp]}`
}

export function SlackInput({
  onMessageSent,
  channelName = "gs-holdings-52g-salesforce-slack",
  onStreamingUpdate,
  externalAttachments,
  onExternalAttachmentsConsumed,
}: SlackInputProps) {
  const [message, setMessage] = useState("")
  const [showCommandDropdown, setShowCommandDropdown] = useState(false)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const [commandFilterText, setCommandFilterText] = useState("")
  const [attachments, setAttachments] = useState<AttachmentState[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false) // 한글 입력 조합 중인지 체크
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showSampleImagesModal, setShowSampleImagesModal] = useState(false)
  const [viewerImage, setViewerImage] = useState<{ url: string; name: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const conversationIdsRef = useRef<Record<string, string | null>>({})
  const processedExternalIdsRef = useRef<Set<string>>(new Set())
  const attachMenuRef = useRef<HTMLDivElement>(null)
  
  // 작업 ID 생성 함수
  const generateTaskId = useCallback(() => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

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

  useEffect(() => {
    conversationIdsRef.current = {}
    processedExternalIdsRef.current.clear()
  }, [channelName])

  useEffect(() => {
    if (!externalAttachments || externalAttachments.length === 0) return

    const pendingAssets = externalAttachments.filter(
      (asset) => !processedExternalIdsRef.current.has(asset.id)
    )

    if (pendingAssets.length === 0) return

    let cancelled = false

    const loadAssets = async () => {
      const newAttachments: AttachmentState[] = []
      const consumedIds: string[] = []

      for (const asset of pendingAssets) {
        processedExternalIdsRef.current.add(asset.id)
        consumedIds.push(asset.id)

        try {
          const response = await fetch(asset.src)
          if (!response.ok) {
            throw new Error(`파일을 불러올 수 없습니다: ${asset.displayName}`)
          }

          const blob = await response.blob()
          const file = new File([blob], asset.displayName, { type: asset.mimeType })
          const previewUrl = URL.createObjectURL(blob)

          newAttachments.push({
            id: `${asset.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: asset.displayName,
            type: asset.kind,
            mimeType: asset.mimeType,
            sizeLabel: asset.sizeLabel,
            file,
            previewUrl,
            source: asset.id.startsWith("photo") ? "photos" : "finder",
            originId: asset.id,
          })
        } catch (err) {
          console.error("Failed to load desktop asset:", err)
          if (!cancelled) {
            setError("선택한 파일을 불러오지 못했습니다. 다시 시도해주세요.")
          }
        }
      }

      if (cancelled) return

      if (newAttachments.length > 0) {
        setAttachments((prev) => [...prev, ...newAttachments])
        setError(null)
      }

      if (consumedIds.length > 0) {
        onExternalAttachmentsConsumed?.(consumedIds)
      }
    }

    void loadAssets()

    return () => {
      cancelled = true
    }
  }, [externalAttachments, onExternalAttachmentsConsumed])

  const getConversationId = useCallback(
    (key: string) => conversationIdsRef.current[key] ?? null,
    []
  )
  const setConversationId = useCallback((key: string, value: string | null) => {
    conversationIdsRef.current[key] = value
  }, [])

  // 메시지 변경 핸들러 - "/" 입력 감지
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // /tbm 또는 /energynews 명령어가 이미 선택되고 띄어쓰기 후 내용이 입력 중인 경우 드롭다운 차단
    // 하지만 이후의 내용이 지워지고 새로운 /로 시작하면 드롭다운 표시
    const commandPattern = /^\/(tbm|energynews|designrisk)\s+\S/
    if (commandPattern.test(value)) {
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

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId))
  }, [])

  type StreamingChatOptions = {
    endpoint: string
    query: string
    taskId: string
    imageFile?: File
    conversationKey?: string
    persistConversation?: boolean
    errorLabel?: string
    uploadEndpoint?: string
  }

  const callStreamingChat = useCallback(
    async ({
      endpoint,
      query,
      taskId,
      imageFile,
      conversationKey,
      persistConversation = false,
      errorLabel,
      uploadEndpoint = "/api/miso/upload",
    }: StreamingChatOptions) => {
      setError(null)

      try {
        let files: Array<{
          type: string
          transfer_method: string
          upload_file_id?: string
          url?: string
        }> | undefined

        if (imageFile) {
          const uploadFormData = new FormData()
          uploadFormData.append("file", imageFile)
          uploadFormData.append("user", "slack_user")

          const uploadResponse = await fetch(uploadEndpoint, {
            method: "POST",
            body: uploadFormData,
          })

          if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json()
            throw new Error(uploadError.detail || uploadError.error || "이미지 업로드에 실패했습니다.")
          }

          const uploadResult = await uploadResponse.json()
          files = [
            {
              type: "image",
              transfer_method: "local_file",
              upload_file_id: uploadResult.id,
            },
          ]
        }

        const conversationId =
          persistConversation && conversationKey ? getConversationId(conversationKey) ?? "" : ""

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {},
            query,
            mode: "blocking",
            conversation_id: conversationId || "",
            user: "slack_user",
            files,
          }),
        })

        if (!response.ok) {
          let errorDetail: string | undefined
          try {
            const errorPayload = await response.json()
            errorDetail = errorPayload?.detail || errorPayload?.error
          } catch {
            errorDetail = response.statusText
          }

          throw new Error(errorDetail || errorLabel || "에이전트 채팅에 실패했습니다.")
        }

        const responseData = await response.json()
        
        // conversation_id 추출
        let lastConversationId: string | undefined
        if (responseData && typeof responseData === "object" && typeof responseData.conversation_id === "string") {
          lastConversationId = responseData.conversation_id
        }

        if (persistConversation && conversationKey && lastConversationId) {
          setConversationId(conversationKey, lastConversationId)
        }

        // 응답에서 answer 필드 추출 (명세서에 따르면 answer 필드에 응답이 있음)
        const answerText = responseData?.answer
        
        if (!answerText || typeof answerText !== "string" || answerText.trim() === "") {
          console.error("응답 데이터:", responseData)
          throw new Error("답변을 받을 수 없습니다. 응답 형식이 올바르지 않습니다.")
        }

        const finalContent = answerText.replace(/<tools>[\s\S]*?<\/tools>/gi, "").trim()

        onMessageSent?.({
          message: "",
          result: finalContent,
          taskId,
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        setError(errorMessage)

        onMessageSent?.({
          message: "",
          result: `ERROR:${errorMessage}`,
          taskId,
        })
      }
    },
    [getConversationId, onMessageSent, setConversationId]
  )

  const callAnGenBotChat = useCallback(
    (query: string, taskId: string, imageFile?: File) =>
      callStreamingChat({
        endpoint: "/api/angenbot/chat",
        query,
        taskId,
        imageFile,
        conversationKey: "anjenbot-safety-bot",
        persistConversation: true,
        errorLabel: "AnGenBot 채팅에 실패했습니다.",
        uploadEndpoint: "/api/angenbot/upload",
      }),
    [callStreamingChat]
  )

  const callDesignRiskChat = useCallback(
    (query: string, taskId: string, imageFile?: File, persistConversation = false) =>
      callStreamingChat({
        endpoint: "/api/designrisk/chat",
        query,
        taskId,
        imageFile,
        conversationKey: persistConversation ? "design-risk-agent" : undefined,
        persistConversation,
        errorLabel: "Design Risk Agent 호출에 실패했습니다.",
        uploadEndpoint: "/api/designrisk/upload",
      }),
    [callStreamingChat]
  )

  // Energy News Workflow API 호출 함수 (blocking 모드, result만 스트리밍 표시)
  const callEnergyNewsWorkflow = useCallback(
    async (query: string, taskId: string) => {
      setError(null)

      try {
        // Energy News Workflow API 호출 (blocking 모드)
        const response = await fetch("/api/energynews/workflow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            mode: "blocking",
          }),
        })

        if (!response.ok) {
          let errorDetail: string | undefined
          try {
            const errorPayload = await response.json()
            errorDetail = errorPayload?.detail || errorPayload?.error
          } catch {
            errorDetail = response.statusText
          }

          throw new Error(errorDetail || "Energy News 워크플로우 실행에 실패했습니다.")
        }

        const responseData = await response.json()

        // outputs.result 또는 result 필드에서 결과 추출
        const result =
          responseData?.outputs?.result ??
          responseData?.data?.outputs?.result ??
          responseData?.data?.result ??
          responseData?.result

        if (!result) {
          throw new Error("결과를 받을 수 없습니다.")
        }

        // result 내용을 문자 단위로 스트리밍처럼 표시
        const resultText =
          typeof result === "string" ? result.trim() : JSON.stringify(result, null, 2)

        if (!resultText) {
          throw new Error("결과를 받을 수 없습니다.")
        }
        const chars = resultText.split("")
        let displayedText = ""

        // 문자를 청크 단위로 추가하면서 스트리밍 효과 구현
        const CHUNK_SIZE = 5 // 한 번에 표시할 문자 수
        for (let i = 0; i < chars.length; i += CHUNK_SIZE) {
          const chunk = chars.slice(i, i + CHUNK_SIZE).join("")
          displayedText += chunk
          onStreamingUpdate?.(taskId, displayedText)
          
          // 자연스러운 스트리밍 효과를 위한 짧은 지연
          await new Promise((resolve) => setTimeout(resolve, 20))
        }

        // 최종 결과 전달
        onMessageSent?.({
          message: "",
          result: resultText,
          taskId,
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        setError(errorMessage)

        onMessageSent?.({
          message: "",
          result: `ERROR:${errorMessage}`,
          taskId,
        })
      }
    },
    [onMessageSent, onStreamingUpdate]
  )

  // MISO API 호출 함수 (비동기, 블로킹 없음)
  const callMisoWorkflow = useCallback(async (query: string, taskId: string, imageFile?: File) => {
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

      // 결과를 콜백으로 전달
      onMessageSent?.({
        message: "",
        result,
        taskId,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
      
      onMessageSent?.({
        message: "",
        result: `ERROR:${errorMessage}`,
        taskId,
      })
    }
  }, [onMessageSent])

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(() => {
    const originalMessage = message
    const trimmedMessage = originalMessage.trim()
    const hasMessage = trimmedMessage.length > 0
    const hasAttachments = attachments.length > 0

    if (!hasMessage && !hasAttachments) {
      return
    }

    const attachmentPayload: MessageFileAttachment[] =
      attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        url: attachment.previewUrl,
        mimeType: attachment.mimeType,
        sizeLabel: attachment.sizeLabel,
      }))

    const firstImageFile = attachments.find((attachment) => attachment.type === "image")?.file

    const resetInputs = () => {
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.value = ""
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setAttachments([])
      setError(null)
    }

    const sendUserMessage = (payload: Partial<SlackSendMessagePayload> & { message: string }) => {
      onMessageSent?.({
        message: payload.message,
        taskId: payload.taskId,
        attachments: attachmentPayload.length > 0 ? attachmentPayload : undefined,
      })
      resetInputs()
    }

    // Channel-specific agents
    if (channelName === "anjenbot-safety-bot") {
      if (!hasMessage) {
        setError("메시지를 입력해주세요.")
        return
      }
      const taskId = generateTaskId()
      sendUserMessage({ message: trimmedMessage, taskId })
      callAnGenBotChat(trimmedMessage, taskId, firstImageFile).catch((err) => {
        console.error("AnGenBot 채팅 실행 실패:", err)
      })
      return
    }

    if (channelName === "design-risk-agent") {
      if (!hasMessage) {
        setError("메시지를 입력해주세요.")
        return
      }
      const taskId = generateTaskId()
      sendUserMessage({ message: trimmedMessage, taskId })
      callDesignRiskChat(trimmedMessage, taskId, firstImageFile, true).catch((err) => {
        console.error("Design Risk Agent 채팅 실행 실패:", err)
      })
      return
    }

    // Slash commands
    if (trimmedMessage.startsWith("/tbm")) {
      const query = trimmedMessage.slice(4).trim()
      if (!query) {
        setError("요청사항을 입력해주세요. 예: /tbm 밀폐공간에서 작업을 위한 수칙")
        return
      }
      const taskId = generateTaskId()
      sendUserMessage({ message: trimmedMessage, taskId })
      callMisoWorkflow(query, taskId, firstImageFile).catch((err) => {
        console.error("MISO 워크플로우 실행 실패:", err)
      })
      return
    }

    if (trimmedMessage.startsWith("/energynews")) {
      const query = trimmedMessage.slice("/energynews".length).trim()
      if (!query) {
        setError("요청사항을 입력해주세요. 예: /energynews 최근 신재생에너지 뉴스")
        return
      }
      const taskId = generateTaskId()
      sendUserMessage({ message: trimmedMessage, taskId })
      callEnergyNewsWorkflow(query, taskId).catch((err) => {
        console.error("Energy News 워크플로우 실행 실패:", err)
      })
      return
    }

    if (trimmedMessage.startsWith("/designrisk")) {
      const query = trimmedMessage.slice("/designrisk".length).trim()
      if (!query) {
        setError("요청사항을 입력해주세요. 예: /designrisk Review the new poster design for compliance risk")
        return
      }
      const taskId = generateTaskId()
      sendUserMessage({ message: trimmedMessage, taskId })
      callDesignRiskChat(query, taskId, firstImageFile, false).catch((err) => {
        console.error("Design Risk Agent 채팅 실행 실패:", err)
      })
      return
    }

    // 일반 메시지 전송
    sendUserMessage({ message: hasMessage ? originalMessage : "" })
  }, [
    message,
    attachments,
    channelName,
    callMisoWorkflow,
    callEnergyNewsWorkflow,
    callAnGenBotChat,
    callDesignRiskChat,
    onMessageSent,
    generateTaskId,
  ])

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
        } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [showCommandDropdown, filteredCommands, selectedCommandIndex, handleCloseDropdown, handleSelectCommand, handleSendMessage, isComposing]
  )

  // 첨부 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false)
      }
    }

    if (showAttachMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAttachMenu])

  // 이미지 파일 선택 핸들러
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const MAX_SIZE = 10 * 1024 * 1024
    const nextAttachments: AttachmentState[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 첨부할 수 있습니다.")
        return
      }

      if (file.size > MAX_SIZE) {
        setError("파일 크기는 10MB를 초과할 수 없습니다.")
        return
      }

      const previewUrl = URL.createObjectURL(file)
      nextAttachments.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: "image",
        mimeType: file.type,
        sizeLabel: formatFileSize(file.size),
        file,
        previewUrl,
        source: "upload",
      })
    })

    if (nextAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...nextAttachments])
      setError(null)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setShowAttachMenu(false)
  }, [])

  // 샘플 이미지 선택 핸들러
  const handleSampleImagesSelect = useCallback(
    async (selectedImages: Array<{ id: string; name: string; url: string }>) => {
      const nextAttachments: AttachmentState[] = []

      for (const image of selectedImages) {
        try {
          const response = await fetch(image.url)
          const blob = await response.blob()
          const file = new File([blob], image.name, { type: blob.type || "image/jpeg" })
          const previewUrl = URL.createObjectURL(blob)

          nextAttachments.push({
            id: `sample-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: image.name,
            type: "image",
            mimeType: blob.type || "image/jpeg",
            sizeLabel: formatFileSize(blob.size),
            file,
            previewUrl,
            source: "upload",
          })
        } catch (err) {
          console.error("샘플 이미지 로드 실패:", err)
          setError(`${image.name} 로드에 실패했습니다.`)
        }
      }

      if (nextAttachments.length > 0) {
        setAttachments((prev) => [...prev, ...nextAttachments])
        setError(null)
      }
    },
    []
  )

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Sample Images Modal */}
      <SampleImagesModal
        isOpen={showSampleImagesModal}
        onClose={() => setShowSampleImagesModal(false)}
        onSelect={handleSampleImagesSelect}
      />

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={viewerImage !== null}
        onClose={() => setViewerImage(null)}
        imageUrl={viewerImage?.url || ""}
        imageName={viewerImage?.name}
      />

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
              placeholder={`#${channelName}에 메시지 보내기`}
              className="w-full px-3 py-3 text-[15px] resize-none focus:outline-none min-h-[80px] placeholder:text-gray-500"
              rows={3}
            />
          </div>

          {/* 첨부 파일 미리보기 */}
          {attachments.length > 0 && (
            <div className="px-3 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-3">
                {attachments.map((attachment) =>
                  attachment.type === "image" ? (
                    <div key={attachment.id} className="relative w-24">
                      <div
                        className="w-24 h-24 rounded border border-gray-300 overflow-hidden bg-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setViewerImage({ url: attachment.previewUrl, name: attachment.name })}
                      >
                        <img
                          src={attachment.previewUrl}
                          alt={attachment.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 z-10"
                        title="첨부 제거"
                      >
                        <X className="w-3 h-3 text-gray-600" />
                      </button>
                      <div className="mt-1 text-[11px] text-gray-600 truncate">{attachment.name}</div>
                    </div>
                  ) : (
                    <div
                      key={attachment.id}
                      className="relative flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 shadow-sm"
                    >
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-gray-800 truncate max-w-[120px]">
                          {attachment.name}
                        </span>
                        <span className="text-[11px] text-gray-500">{attachment.sizeLabel}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="ml-1 p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800"
                        title="첨부 제거"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                )}
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
              <div ref={attachMenuRef} className="relative">
                <button
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                  title="파일 첨부"
                >
                  <Plus className="w-[18px] h-[18px]" />
                </button>
                {showAttachMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        fileInputRef.current?.click()
                        setShowAttachMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left text-sm text-gray-700"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>로컬 파일</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowSampleImagesModal(true)
                        setShowAttachMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-left text-sm text-gray-700"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>샘플 이미지</span>
                    </button>
                  </div>
                )}
              </div>
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
                disabled={!message.trim() && attachments.length === 0}
                title="Send"
              >
                <Send className="w-[18px] h-[18px]" />
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
