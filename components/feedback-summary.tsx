"use client"

import { Button } from "@/components/ui/button"

interface FeedbackItem {
  author: string
  content: string
}

interface FeedbackSummaryProps {
  feedbacks: FeedbackItem[]
  changes: string[]
  onApply?: () => void
  onPartial?: () => void
  onCancel?: () => void
}

export function FeedbackSummary({ feedbacks, changes, onApply, onPartial, onCancel }: FeedbackSummaryProps) {
  return (
    <div
      className="border rounded-lg p-4 my-2"
      style={{
        borderColor: "var(--slack-border)",
        backgroundColor: "var(--slack-bg)",
      }}
    >
      <h3 className="font-bold text-base mb-3" style={{ color: "var(--slack-text)" }}>
        📋 피드백 요약
      </h3>

      <p className="text-sm mb-3" style={{ color: "var(--slack-text)" }}>
        총 {feedbacks.length}개의 피드백이 수집되었습니다:
      </p>

      <ul className="space-y-2 mb-4 text-sm" style={{ color: "var(--slack-text)" }}>
        {feedbacks.map((feedback, idx) => (
          <li key={idx}>
            {idx + 1}. <span className="font-semibold">{feedback.author}</span>: {feedback.content}
          </li>
        ))}
      </ul>

      <div className="border-t pt-3 mb-3" style={{ borderColor: "var(--slack-border)" }}>
        <div className="font-semibold text-sm mb-2" style={{ color: "var(--slack-text)" }}>
          제안된 변경사항:
        </div>
        <ul className="space-y-1 text-sm" style={{ color: "var(--slack-text)" }}>
          {changes.map((change, idx) => (
            <li key={idx}>
              {idx + 1}. {change}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <Button onClick={onApply} size="sm" className="bg-[#007A5A] hover:bg-[#006B4E] text-white border-0">
          반영하기
        </Button>
        <Button
          onClick={onPartial}
          size="sm"
          variant="outline"
          className="border-[#E1E1E1] hover:bg-[#F8F9FA] bg-transparent"
          style={{ color: "var(--slack-text)" }}
        >
          일부만 반영
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="border-[#E1E1E1] hover:bg-[#F8F9FA] bg-transparent"
          style={{ color: "var(--slack-text)" }}
        >
          취소
        </Button>
      </div>
    </div>
  )
}
