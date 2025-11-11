"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Minus, Maximize2, Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react"

interface PhotosWindowProps {
  isOpen: boolean
  onClose: () => void
}

// 샘플 사진 목록
const SAMPLE_PHOTOS = [
  { id: 1, src: "/photos/photo1.jpg", name: "Photo 1" },
  { id: 2, src: "/photos/photo2.png", name: "Photo 2" },
  { id: 3, src: "/photos/photo3.jpg", name: "Photo 3" },
  { id: 4, src: "/photos/photo4.png", name: "Photo 4" },
  { id: 5, src: "/photos/photo5.png", name: "Photo 5" },
  { id: 6, src: "/photos/photo6.jpg", name: "Photo 6" },
  { id: 7, src: "/photos/photo7.jpg", name: "Photo 7" },
]

export function PhotosWindow({ isOpen, onClose }: PhotosWindowProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (!isOpen) return null

  const handlePhotoClick = (photoId: number) => {
    setSelectedPhoto(photoId)
  }

  const handleCloseDetail = () => {
    setSelectedPhoto(null)
  }

  const handlePrevious = () => {
    if (selectedPhoto === null) return
    const currentIndex = SAMPLE_PHOTOS.findIndex((p) => p.id === selectedPhoto)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : SAMPLE_PHOTOS.length - 1
    setSelectedPhoto(SAMPLE_PHOTOS[previousIndex].id)
  }

  const handleNext = () => {
    if (selectedPhoto === null) return
    const currentIndex = SAMPLE_PHOTOS.findIndex((p) => p.id === selectedPhoto)
    const nextIndex = currentIndex < SAMPLE_PHOTOS.length - 1 ? currentIndex + 1 : 0
    setSelectedPhoto(SAMPLE_PHOTOS[nextIndex].id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedPhoto === null) return
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") handleCloseDetail()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS 스타일 타이틀 바 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 shrink-0">
          {/* 왼쪽: macOS 윈도우 컨트롤 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer group relative"
              aria-label="닫기"
            >
              <X className="h-2 w-2 text-red-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer group relative"
              aria-label="최소화"
              onClick={onClose}
            >
              <Minus className="h-2 w-2 text-yellow-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer group relative"
              aria-label="최대화"
            >
              <Maximize2 className="h-2 w-2 text-green-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* 중앙: 앱 제목 */}
          <div className="flex-1 text-center">
            <h2 className="text-sm font-medium text-gray-700">Photos</h2>
          </div>

          {/* 오른쪽: 빈 공간 (레이아웃 균형을 위해) */}
          <div className="w-20" />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 사이드바 */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 shrink-0 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Library</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                  All Photos
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Favorites
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Recently Added
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Videos
                </button>
              </div>

              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 mt-6">Albums</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  My Albums
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Shared Albums
                </button>
              </div>
            </div>
          </div>

          {/* 사진 그리드 영역 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 툴바 */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="그리드 보기"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="리스트 보기"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {SAMPLE_PHOTOS.length} photos
              </div>
            </div>

            {/* 사진 그리드 */}
            <div className="flex-1 overflow-y-auto p-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-4 gap-4">
                  {SAMPLE_PHOTOS.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => handlePhotoClick(photo.id)}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:opacity-90 transition-opacity bg-gray-100"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {SAMPLE_PHOTOS.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => handlePhotoClick(photo.id)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="relative w-20 h-20 rounded overflow-hidden shrink-0 bg-gray-200">
                        <Image
                          src={photo.src}
                          alt={photo.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{photo.name}</div>
                        <div className="text-xs text-gray-500">JPEG Image</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 사진 상세 보기 모달 */}
        {selectedPhoto !== null && (
          <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={handleCloseDetail}
          >
            <div className="relative w-full h-full flex items-center justify-center p-8">
              {/* 닫기 버튼 */}
              <button
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
                aria-label="닫기"
              >
                <X className="w-6 h-6" />
              </button>

              {/* 이전 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors p-4"
                aria-label="이전"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              {/* 다음 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors p-4"
                aria-label="다음"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* 사진 */}
              <div 
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={SAMPLE_PHOTOS.find((p) => p.id === selectedPhoto)?.src || ""}
                  alt={SAMPLE_PHOTOS.find((p) => p.id === selectedPhoto)?.name || ""}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[90vh] object-contain"
                  priority
                />
              </div>

              {/* 사진 정보 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {SAMPLE_PHOTOS.findIndex((p) => p.id === selectedPhoto) + 1} / {SAMPLE_PHOTOS.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

