"use client"

interface ExternalUsersNoticeProps {
  externalCount: number
  teamName: string
}

export function ExternalUsersNotice({ externalCount, teamName }: ExternalUsersNoticeProps) {
  return (
    <div className="px-5 py-3 bg-[#F7F3E8] border-l-4 border-[#E8D9B5] text-[13px] text-gray-700 flex items-start gap-2 mx-5 my-2">
      <svg
        className="w-4 h-4 text-[#1264A3] shrink-0 mt-0.5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7.5 2.25h9a5.25 5.25 0 110 10.5h-9a5.25 5.25 0 110-10.5z"/>
        <path d="M7.5 21.75h9a5.25 5.25 0 100-10.5h-9a5.25 5.25 0 100 10.5z"/>
      </svg>
      <span>
        {externalCount} external users from {teamName} are in this channel
      </span>
    </div>
  )
}

