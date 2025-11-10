import { NextRequest, NextResponse } from "next/server"

const MISO_API_KEY = process.env.MISO_API_KEY
const BASE_API_URL = "https://api.holdings.miso.gs/ext/v1"
const UPLOAD_ENDPOINT = `${BASE_API_URL}/files/upload`

if (!MISO_API_KEY) {
  console.error("❌ MISO_API_KEY 환경변수가 설정되지 않았습니다.")
}

export async function POST(request: NextRequest) {
  try {
    if (!MISO_API_KEY) {
      return NextResponse.json(
        {
          error: "MISO_API_KEY가 설정되지 않았습니다.",
          detail: "환경변수 MISO_API_KEY를 설정해주세요.",
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const user = formData.get("user") as string | null

    if (!file) {
      return NextResponse.json(
        {
          error: "파일이 제공되지 않았습니다.",
          detail: "요청에 파일을 포함해주세요.",
        },
        { status: 400 }
      )
    }

    // MIME 타입 확인
    const mimeType = file.type
    if (!mimeType || !mimeType.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "지원되지 않는 파일 형식입니다.",
          detail: "이미지 파일만 업로드 가능합니다.",
        },
        { status: 400 }
      )
    }

    // MISO API로 파일 업로드
    const uploadFormData = new FormData()
    uploadFormData.append("file", file, file.name)
    if (user) {
      uploadFormData.append("user", user)
    }

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISO_API_KEY}`,
      },
      body: uploadFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      return NextResponse.json(
        {
          error: "파일 업로드 실패",
          detail: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error)
    return NextResponse.json(
      {
        error: "내부 서버 오류",
        detail: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}

