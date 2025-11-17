import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const sampleImagesDir = path.join(process.cwd(), "public", "sample-images")
    
    // 디렉토리가 존재하지 않으면 빈 배열 반환
    if (!fs.existsSync(sampleImagesDir)) {
      return NextResponse.json([])
    }

    // 디렉토리에서 파일 목록 읽기
    const files = fs.readdirSync(sampleImagesDir)
    
    // 이미지 파일만 필터링 (jpg, jpeg, png, gif, webp)
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)
    })

    // 이미지 정보 배열 생성
    const images = imageFiles.map((file, index) => ({
      id: `sample-${index + 1}`,
      name: file,
      url: `/sample-images/${file}`,
      thumbnail: `/sample-images/${file}`,
    }))

    return NextResponse.json(images)
  } catch (error) {
    console.error("샘플 이미지 목록 조회 중 오류:", error)
    return NextResponse.json(
      {
        error: "샘플 이미지 목록을 가져올 수 없습니다.",
        detail: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}

