"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageName?: string
}

export function ImageViewerModal({ isOpen, onClose, imageUrl, imageName }: ImageViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden bg-black/95">
        <DialogTitle className="sr-only">Image Viewer</DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Name */}
          {imageName && (
            <div className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-black/50 rounded text-white text-sm">
              {imageName}
            </div>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={imageUrl}
              alt={imageName || "Image"}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

