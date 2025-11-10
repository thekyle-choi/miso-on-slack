"use client"

import { ChevronDown } from "lucide-react"

interface DateSeparatorProps {
  date: string
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="absolute top-4 left-0 right-0 flex items-center justify-center z-10 pointer-events-none">
      <button className="pointer-events-auto flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm">
        {date}
        <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
      </button>
    </div>
  )
}

