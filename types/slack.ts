import type { MessageFileAttachment } from "@/constants/messages"

export type SlackSendMessagePayload = {
  message: string
  result?: string
  taskId?: string
  attachments?: MessageFileAttachment[]
}


