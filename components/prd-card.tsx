"use client"

import { Button } from "@/components/ui/button"

interface PRDCardProps {
  title: string
  creator: string
  summary: string[]
  onViewDetails?: () => void
  onDownload?: () => void
  onFeedback?: () => void
}

export function PRDCard({ title, creator, summary, onViewDetails, onDownload, onFeedback }: PRDCardProps) {
  return (
    <div
      className="border rounded-lg p-4 my-2"
      style={{
        borderColor: "var(--slack-border)",
        backgroundColor: "var(--slack-bg)",
      }}
    >
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">📄</span>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1" style={{ color: "var(--slack-text)" }}>
            PRD 문서 생성 완료
          </h3>
          <div className="text-sm mb-2" style={{ color: "var(--slack-text-muted)" }}>
            <span className="font-medium">프로젝트:</span> {title}
            <br />
            <span className="font-medium">생성자:</span> {creator}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-semibold text-sm mb-2" style={{ color: "var(--slack-text)" }}>
          [PRD 요약]
        </div>
        <ul className="space-y-1 text-sm" style={{ color: "var(--slack-text)" }}>
          {summary.map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 mb-3">
        <Button onClick={onViewDetails} size="sm" className="bg-[#007A5A] hover:bg-[#006B4E] text-white border-0">
          상세 보기
        </Button>
        <Button
          onClick={onDownload}
          size="sm"
          variant="outline"
          className="border-[#E1E1E1] hover:bg-[#F8F9FA] bg-transparent"
          style={{ color: "var(--slack-text)" }}
        >
          다운로드
        </Button>
        <Button
          onClick={onFeedback}
          size="sm"
          variant="outline"
          className="border-[#E1E1E1] hover:bg-[#F8F9FA] bg-transparent"
          style={{ color: "var(--slack-text)" }}
        >
          피드백 남기기
        </Button>
      </div>

      <div
        className="border-t pt-3 text-sm"
        style={{
          borderColor: "var(--slack-border)",
          color: "var(--slack-text-muted)",
        }}
      >
        💬 팀원들의 피드백을 기다리고 있습니다!
      </div>
    </div>
  )
}
