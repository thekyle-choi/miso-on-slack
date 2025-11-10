# MISO 워크플로우 연동 가이드

## 개요

이 프로젝트는 Slack 인터페이스에서 `/tbm` 명령어를 통해 MISO 워크플로우를 실행하여 안전 작업 계획서를 생성하는 기능을 제공합니다.

## 환경 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```bash
# MISO API 키 (필수)
MISO_API_KEY=your_miso_api_key_here

# MISO 사용자 ID (선택사항, 기본값: slack_user)
MISO_USER_ID=slack_user
```

### 2. MISO API 키 발급

MISO 시스템에서 API 키를 발급받아 `.env.local` 파일에 설정하세요.

## 사용 방법

### 기본 사용법

1. Slack 입력창에 `/tbm` 명령어를 입력합니다.
2. 명령어 뒤에 요청사항을 작성합니다.
3. (선택사항) 이미지를 첨부할 수 있습니다.
4. Enter 키를 누르거나 전송 버튼을 클릭합니다.

### 예시

```
/tbm 밀폐공간에서 작업을 위한 수칙
```

### 이미지 첨부

1. 입력창 하단의 `+` 버튼을 클릭합니다.
2. 이미지 파일을 선택합니다 (최대 10MB).
3. 이미지 미리보기가 표시됩니다.
4. `/tbm` 명령어와 함께 요청사항을 작성하고 전송합니다.

## API 엔드포인트

### 파일 업로드

- **경로**: `/api/miso/upload`
- **메서드**: `POST`
- **요청**: `FormData` (file, user)
- **응답**: 업로드된 파일의 ID

### 워크플로우 실행

- **경로**: `/api/miso/workflow`
- **메서드**: `POST`
- **요청**: JSON
  ```json
  {
    "query": "사용자 요청사항",
    "image": {
      "upload_file_id": "파일 ID (선택사항)"
    },
    "mode": "blocking"
  }
  ```
- **응답**: 워크플로우 실행 결과

## 에러 처리

API 호출 실패 시 다음 에러 메시지가 표시됩니다:

- `invalid_param`: 잘못된 파라미터 입력
- `app_unavailable`: 앱을 사용할 수 없음
- `provider_not_initialize`: 모델 인증 정보 없음
- `provider_quota_exceeded`: 쿼터 초과
- `model_currently_not_support`: 모델 사용 불가
- `workflow_request_error`: 워크플로우 실행 실패
- `internal_server_error`: 내부 서버 오류

## 기능

- ✅ `/tbm` 명령어 인식 및 처리
- ✅ 이미지 파일 업로드 및 첨부
- ✅ MISO 워크플로우 실행
- ✅ 마크다운 형식 결과 표시
- ✅ 에러 처리 및 사용자 피드백
- ✅ 로딩 상태 표시

## 주의사항

- 이미지 파일은 최대 10MB까지 업로드 가능합니다.
- 이미지 파일만 첨부 가능합니다 (JPG, PNG, GIF 등).
- MISO API 키가 설정되지 않으면 기능이 동작하지 않습니다.

