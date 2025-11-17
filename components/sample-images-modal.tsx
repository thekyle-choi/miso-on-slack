"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface SampleImage {
  id: string
  name: string
  url: string
  thumbnail: string
}

interface SampleImagesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (images: SampleImage[]) => void
}

export function SampleImagesModal({ isOpen, onClose, onSelect }: SampleImagesModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [images, setImages] = useState<SampleImage[]>([])
  const [loading, setLoading] = useState(true)

  // 샘플 이미지 목록 가져오기
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch("/api/sample-images")
        .then((res) => res.json())
        .then((data) => {
          setImages(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("샘플 이미지 로드 실패:", error)
          setImages([])
          setLoading(false)
        })
    }
  }, [isOpen])

  const handleImageClick = (imageId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(images.map((img) => img.id)))
    }
  }

  const handleConfirm = () => {
    const selectedImages = images.filter((img) => selectedIds.has(img.id))
    onSelect(selectedImages)
    setSelectedIds(new Set())
    onClose()
  }

  const handleCancel = () => {
    setSelectedIds(new Set())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Sample Images Gallery</DialogTitle>
        <div className="flex flex-col h-full bg-[#1e1e1e]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-semibold text-sm">Sample Images</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-xs text-white bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded transition-colors"
                disabled={images.length === 0}
              >
                {selectedIds.size === images.length ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-sm">Loading images...</div>
              </div>
            ) : images.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-sm text-center">
                  <p>No sample images found.</p>
                  <p className="mt-2 text-xs">Add images to public/sample-images/ folder</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image) => {
                const isSelected = selectedIds.has(image.id)
                return (
                  <div
                    key={image.id}
                    onClick={() => handleImageClick(image.id)}
                    className={`relative aspect-square cursor-pointer group rounded-lg overflow-hidden ${
                      isSelected ? "ring-4 ring-blue-500" : ""
                    }`}
                  >
                    <Image
                      src={image.thumbnail}
                      alt={image.name}
                      fill
                      className={`object-cover transition-opacity ${
                        isSelected ? "opacity-90" : "opacity-100 group-hover:opacity-80"
                      }`}
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs truncate">{image.name}</p>
                    </div>
                  </div>
                )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 bg-[#2d2d2d] border-t border-gray-700">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Add {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

