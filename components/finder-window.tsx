"use client"

import { useState } from "react"
import { 
  ChevronLeft, 
  ChevronRight,
  Grid3x3,
  List,
  Columns3,
  LayoutGrid,
  Search,
  Star,
  Clock,
  Download,
  Monitor,
  Heart,
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FINDER_ATTACHMENTS, type DesktopAsset } from "@/constants/desktop-assets"

interface FinderWindowProps {
  isOpen: boolean
  onClose: () => void
  onAttach?: (asset: DesktopAsset) => void
}

type ViewMode = "icons" | "list" | "columns" | "gallery"

type SidebarItem = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}

type FileItem = {
  id: string
  name: string
  type: "folder" | "file"
  icon: React.ComponentType<{ className?: string }>
  attachmentId?: string
  size?: string
  modified?: string
  color?: string
}

export function FinderWindow({ isOpen, onClose, onAttach }: FinderWindowProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("icons")
  const [currentPath, setCurrentPath] = useState("최근 항목")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const favoritesItems: SidebarItem[] = [
    { icon: Clock, label: "최근 항목" },
    { icon: Star, label: "즐겨찾기" },
    { icon: Download, label: "다운로드", badge: 3 },
    { icon: Monitor, label: "데스크탑" },
    { icon: Heart, label: "문서" },
  ]

  const icloudItems: SidebarItem[] = [
    { icon: Folder, label: "iCloud Drive" },
  ]

  const locationItems: SidebarItem[] = [
    { icon: Monitor, label: "MacBook Pro" },
  ]

  const fileItems: FileItem[] = [
    { 
      id: "1", 
      name: "프로젝트", 
      type: "folder", 
      icon: Folder,
      color: "text-blue-500",
      modified: "오늘 오후 2:30"
    },
    { 
      id: "2", 
      name: "문서", 
      type: "folder", 
      icon: Folder,
      color: "text-blue-500",
      modified: "어제 오전 11:20"
    },
    { 
      id: "3", 
      name: "이미지", 
      type: "folder", 
      icon: Folder,
      color: "text-blue-500",
      modified: "2024.11.08"
    },
    { 
      id: "4", 
      name: "보고서.pdf", 
      type: "file", 
      icon: FileText,
    attachmentId: "4",
      color: "text-red-500",
      size: "2.4 MB",
      modified: "오늘 오전 9:15"
    },
    { 
      id: "5", 
      name: "vacation.jpg", 
      type: "file", 
      icon: ImageIcon,
    attachmentId: "5",
      color: "text-orange-500",
      size: "5.1 MB",
      modified: "2024.11.05"
    },
    { 
      id: "6", 
      name: "music.mp3", 
      type: "file", 
      icon: Music,
      color: "text-purple-500",
      size: "8.2 MB",
      modified: "2024.11.03"
    },
    { 
      id: "7", 
      name: "video.mp4", 
      type: "file", 
      icon: Video,
      color: "text-pink-500",
      size: "124 MB",
      modified: "2024.11.01"
    },
    { 
      id: "8", 
      name: "readme.txt", 
      type: "file", 
      icon: FileText,
      color: "text-gray-500",
      size: "1.2 KB",
      modified: "2024.10.28"
  },
  { 
    id: "9", 
    name: "design-risk.png", 
    type: "file", 
    icon: ImageIcon,
    attachmentId: "9",
    color: "text-purple-500",
    size: "820 KB",
    modified: "2024.11.07"
    },
  ]

  const selectedAttachment = (() => {
    if (!selectedItem) return undefined
    const file = fileItems.find((item) => item.id === selectedItem)
    if (!file?.attachmentId) return undefined
    return FINDER_ATTACHMENTS[file.attachmentId]
  })()

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="w-[85vw] h-[80vh] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS 윈도우 컨트롤 바 */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-gray-50/90 to-gray-100/90 border-b border-gray-200/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2">
            {/* 트래픽 라이트 버튼 */}
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors group relative"
              aria-label="닫기"
            >
              <X className="absolute inset-0 m-auto w-2 h-2 text-[#4A0000] opacity-0 group-hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 transition-colors"
              aria-label="최소화"
            />
            <button
              className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-colors"
              aria-label="최대화"
            />
          </div>
          
          {/* 타이틀 */}
          <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-gray-700">
            {currentPath}
          </div>
        </div>

        {/* 툴바 */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/50 backdrop-blur-xl border-b border-gray-200/50 shrink-0">
          {/* 좌측: 네비게이션 버튼들 */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-gray-200/50"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-gray-200/50"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* 중앙: 보기 옵션 */}
          <div className="flex items-center gap-1 bg-gray-100/70 rounded-lg p-0.5">
            <Button
              variant={viewMode === "icons" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("icons")}
              className="h-6 w-6"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-6 w-6"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "columns" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("columns")}
              className="h-6 w-6"
            >
              <Columns3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "gallery" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("gallery")}
              className="h-6 w-6"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* 우측: 검색 */}
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              type="text"
              placeholder="검색"
              className="h-7 pl-8 pr-3 text-sm bg-gray-100/70 border-none focus:bg-white focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 사이드바 */}
          <div className="w-44 bg-gradient-to-b from-gray-50/40 to-gray-100/40 backdrop-blur-xl border-r border-gray-200/50 overflow-y-auto shrink-0">
            {/* 즐겨찾기 섹션 */}
            <div className="py-3">
              <div className="px-3 mb-1">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  즐겨찾기
                </p>
              </div>
              {favoritesItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPath(item.label)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                      currentPath === item.label
                        ? "bg-gray-200/60 text-gray-900"
                        : "text-gray-700 hover:bg-gray-200/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-300/70 text-gray-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* iCloud 섹션 */}
            <div className="py-3 border-t border-gray-200/50">
              <div className="px-3 mb-1">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  iCloud
                </p>
              </div>
              {icloudItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPath(item.label)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                      currentPath === item.label
                        ? "bg-gray-200/60 text-gray-900"
                        : "text-gray-700 hover:bg-gray-200/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* 위치 섹션 */}
            <div className="py-3 border-t border-gray-200/50">
              <div className="px-3 mb-1">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  위치
                </p>
              </div>
              {locationItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPath(item.label)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                      currentPath === item.label
                        ? "bg-gray-200/60 text-gray-900"
                        : "text-gray-700 hover:bg-gray-200/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 파일 브라우저 영역 */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white/30">
            {/* 파일 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              {viewMode === "icons" && (
                <div className="grid grid-cols-6 gap-4">
                  {fileItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:bg-gray-100/50 ${
                          selectedItem === item.id ? "bg-blue-100/50 ring-2 ring-blue-400" : ""
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${item.type === "folder" ? "bg-blue-50" : "bg-gray-50"}`}>
                          <Icon className={`h-8 w-8 ${item.color || "text-gray-600"}`} />
                        </div>
                        <span className="text-xs text-gray-700 text-center line-clamp-2 w-full">
                          {item.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-0.5">
                  {fileItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          selectedItem === item.id 
                            ? "bg-blue-100/50 ring-1 ring-blue-400" 
                            : "hover:bg-gray-100/50"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${item.color || "text-gray-600"} shrink-0`} />
                        <span className="flex-1 text-sm text-left text-gray-700">{item.name}</span>
                        <span className="text-xs text-gray-500">{item.modified}</span>
                        {item.size && (
                          <span className="text-xs text-gray-500 w-16 text-right">{item.size}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {viewMode === "columns" && (
                <div className="flex gap-4 h-full">
                  <div className="w-56 bg-white/50 rounded-lg border border-gray-200/50 overflow-y-auto">
                    {fileItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                            selectedItem === item.id 
                              ? "bg-blue-100 text-blue-900" 
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${item.color || "text-gray-600"} shrink-0`} />
                          <span className="flex-1 text-left truncate text-gray-700">{item.name}</span>
                        </button>
                      )
                    })}
                  </div>
                  {selectedItem && (
                    <div className="flex-1 bg-white/50 rounded-lg border border-gray-200/50 p-4">
                      <p className="text-sm text-gray-600">파일 미리보기</p>
                    </div>
                  )}
                </div>
              )}

              {viewMode === "gallery" && (
                <div className="grid grid-cols-4 gap-3">
                  {fileItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={`aspect-square flex flex-col items-center justify-center gap-2 rounded-lg transition-all hover:bg-gray-100/50 ${
                          selectedItem === item.id ? "bg-blue-100/50 ring-2 ring-blue-400" : "bg-gray-50/50"
                        }`}
                      >
                        <Icon className={`h-12 w-12 ${item.color || "text-gray-600"}`} />
                        <span className="text-xs text-gray-700 text-center line-clamp-1 px-2">
                          {item.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 상태바 */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-gray-100/40 to-gray-100/60 backdrop-blur-xl border-t border-gray-200/50 shrink-0">
              <span className="text-xs text-gray-600">
                {fileItems.length}개 항목
                {selectedItem && " · 1개 선택됨"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  여유 공간: 256 GB
                </span>
                {selectedAttachment && (
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={() => onAttach?.(selectedAttachment)}
                  >
                    Slack에 첨부
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

