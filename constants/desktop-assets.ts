export type DesktopAssetType = "image" | "document"

export type DesktopAsset = {
  id: string
  name: string
  displayName: string
  kind: DesktopAssetType
  src: string
  mimeType: string
  sizeLabel: string
  thumbnailSrc?: string
}

export const FINDER_ATTACHMENTS: Record<string, DesktopAsset> = {
  "5": {
    id: "finder-vacation-photo",
    name: "vacation",
    displayName: "vacation.jpg",
    kind: "image",
    src: "/photos/photo4.png",
    thumbnailSrc: "/photos/photo4.png",
    mimeType: "image/png",
    sizeLabel: "5.1 MB",
  },
  "4": {
    id: "finder-report",
    name: "report",
    displayName: "design-brief.txt",
    kind: "document",
    src: "/assets/documents/design-brief.txt",
    mimeType: "text/plain",
    sizeLabel: "12 KB",
  },
  "9": {
    id: "finder-design-risk",
    name: "design-risk-reference",
    displayName: "design-risk.png",
    kind: "image",
    src: "/assets/design-risk.png",
    thumbnailSrc: "/assets/design-risk.png",
    mimeType: "image/png",
    sizeLabel: "820 KB",
  },
}

export const PHOTOS_LIBRARY: DesktopAsset[] = [
  {
    id: "photo-1",
    name: "Turbine Sunset",
    displayName: "turbine-sunset.jpg",
    kind: "image",
    src: "/photos/photo1.jpg",
    thumbnailSrc: "/photos/photo1.jpg",
    mimeType: "image/jpeg",
    sizeLabel: "1.8 MB",
  },
  {
    id: "photo-2",
    name: "Control Room",
    displayName: "control-room.png",
    kind: "image",
    src: "/photos/photo2.png",
    thumbnailSrc: "/photos/photo2.png",
    mimeType: "image/png",
    sizeLabel: "2.4 MB",
  },
  {
    id: "photo-3",
    name: "Maintenance Crew",
    displayName: "maintenance-crew.jpg",
    kind: "image",
    src: "/photos/photo3.jpg",
    thumbnailSrc: "/photos/photo3.jpg",
    mimeType: "image/jpeg",
    sizeLabel: "2.0 MB",
  },
  {
    id: "photo-4",
    name: "Design Review",
    displayName: "design-review.png",
    kind: "image",
    src: "/photos/photo4.png",
    thumbnailSrc: "/photos/photo4.png",
    mimeType: "image/png",
    sizeLabel: "1.2 MB",
  },
  {
    id: "photo-5",
    name: "Safety Drill",
    displayName: "safety-drill.png",
    kind: "image",
    src: "/photos/photo5.png",
    thumbnailSrc: "/photos/photo5.png",
    mimeType: "image/png",
    sizeLabel: "2.8 MB",
  },
  {
    id: "photo-6",
    name: "Inspection Team",
    displayName: "inspection-team.jpg",
    kind: "image",
    src: "/photos/photo6.jpg",
    thumbnailSrc: "/photos/photo6.jpg",
    mimeType: "image/jpeg",
    sizeLabel: "2.1 MB",
  },
  {
    id: "photo-7",
    name: "Solar Array",
    displayName: "solar-array.jpg",
    kind: "image",
    src: "/photos/photo7.jpg",
    thumbnailSrc: "/photos/photo7.jpg",
    mimeType: "image/jpeg",
    sizeLabel: "1.9 MB",
  },
]


