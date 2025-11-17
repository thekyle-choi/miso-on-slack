import { NextRequest, NextResponse } from "next/server"

const ENERGYNEWS_API_KEY = process.env.ENERGYNEWS_API_KEY
const BASE_API_URL = "https://api.holdings.miso.gs/ext/v1"
const WORKFLOW_ENDPOINT = `${BASE_API_URL}/workflows/run`
const USER_ID = process.env.ENERGYNEWS_USER_ID || "slack_user"

if (!ENERGYNEWS_API_KEY) {
  console.error("❌ ENERGYNEWS_API_KEY 환경변수가 설정되지 않았습니다.")
}

// 에러 코드에 따른 한글 메시지 매핑
const ERROR_MESSAGES: Record<string, { title: string; detail: string }> = {
  invalid_param: {
    title: "잘못된 파라미터 입력",
    detail: "요청 파라미터를 확인해주세요. 앱이 발행되지 않았다면 MISO 앱 편집화면에서 저장 버튼을 눌러주세요.",
  },
  app_unavailable: {
    title: "앱을 사용할 수 없음",
    detail: "앱(App) 설정 정보를 사용할 수 없습니다. MISO 관리자에게 문의해주세요.",
  },
  provider_not_initialize: {
    title: "모델 인증 정보 없음",
    detail: "사용 가능한 모델 인증 정보가 없습니다. MISO 관리자에게 문의해주세요.",
  },
  provider_quota_exceeded: {
    title: "쿼터 초과",
    detail: "모델 호출 쿼터(Quota)가 초과되었습니다. MISO 관리자에게 문의해주세요.",
  },
  model_currently_not_support: {
    title: "모델 사용 불가",
    detail: "현재 모델을 사용할 수 없습니다. MISO 관리자에게 문의해주세요.",
  },
  workflow_request_error: {
    title: "워크플로우 실행 실패",
    detail: "워크플로우 실행 중 오류가 발생했습니다. 요청 내용을 확인해주세요.",
  },
  internal_server_error: {
    title: "내부 서버 오류",
    detail: "MISO 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
}

function getErrorMessage(statusCode: number, errorCode?: string): { title: string; detail: string } {
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode]
  }

  if (statusCode === 400) {
    return {
      title: "잘못된 요청",
      detail: "요청 형식이 올바르지 않습니다. 입력값을 확인해주세요.",
    }
  }

  if (statusCode === 500) {
    return ERROR_MESSAGES.internal_server_error
  }

  return {
    title: "요청 실패",
    detail: `HTTP ${statusCode}: 요청 처리 중 오류가 발생했습니다.`,
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!ENERGYNEWS_API_KEY) {
      return NextResponse.json(
        {
          error: "ENERGYNEWS_API_KEY가 설정되지 않았습니다.",
          detail: "환경변수 ENERGYNEWS_API_KEY를 설정해주세요.",
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { query, mode = "blocking" } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          error: "query 파라미터가 필요합니다.",
          detail: "query는 필수 입력값입니다.",
        },
        { status: 400 }
      )
    }

    // 요청 페이로드 구성
    const payload: {
      inputs: {
        query: string
      }
      mode: string
      user: string
    } = {
      inputs: {
        query,
      },
      mode,
      user: USER_ID,
    }

    // 블로킹 모드로 실행 (기본값)
    const response = await fetch(WORKFLOW_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENERGYNEWS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      const errorCode = responseData?.code || responseData?.error
      const errorMessage = getErrorMessage(response.status, errorCode)

      return NextResponse.json(
        {
          error: errorMessage.title,
          detail: errorMessage.detail,
          code: errorCode,
          status: response.status,
        },
        { status: response.status }
      )
    }

    // 성공 응답 반환
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Energy News 워크플로우 실행 중 오류 발생:", error)
    return NextResponse.json(
      {
        error: "내부 서버 오류",
        detail: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  }
}

