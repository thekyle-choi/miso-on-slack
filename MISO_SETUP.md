# MISO 워크플로우 연동 가이드

## 개요

이 프로젝트는 Slack 인터페이스에서 다음 명령어들을 통해 MISO 워크플로우를 실행하는 기능을 제공합니다:
- `/tbm`: 안전 작업 계획서(TBM) 생성
- `/energynews`: 에너지뉴스 스크래핑

## 환경 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```bash
# MISO API 키 - TBM 워크플로우용 (필수)
MISO_API_KEY=your_miso_api_key_here

# MISO 사용자 ID (선택사항, 기본값: slack_user)
MISO_USER_ID=slack_user

# Energy News API 키 - Energy News 스크래핑용 (필수)
ENERGYNEWS_API_KEY=your_energynews_api_key_here

# Energy News 사용자 ID (선택사항, 기본값: slack_user)
ENERGYNEWS_USER_ID=slack_user

# AnGenBot API 키 - AnGenBot 채팅용 (선택사항)
ANGENBOT_API_KEY=your_angenbot_api_key_here
ANGENBOT_USER_ID=slack_user
```

### 2. API 키 발급

각 기능별로 필요한 API 키를 발급받아 `.env.local` 파일에 설정하세요:

- **MISO_API_KEY**: TBM 워크플로우 실행을 위한 MISO API 키
- **ENERGYNEWS_API_KEY**: Energy News 스크래핑을 위한 MISO API 키 (별도)
- **ANGENBOT_API_KEY**: AnGenBot 채팅 기능을 위한 API 키 (선택사항)

## 사용 방법

### TBM 명령어 (`/tbm`)

1. Slack 입력창에 `/tbm` 명령어를 입력합니다.
2. 명령어 뒤에 요청사항을 작성합니다.
3. (선택사항) 이미지를 첨부할 수 있습니다.
4. Enter 키를 누르거나 전송 버튼을 클릭합니다.

**예시:**
```
/tbm 밀폐공간에서 작업을 위한 수칙
```

### Energy News 명령어 (`/energynews`)

1. Slack 입력창에 `/energynews` 명령어를 입력합니다.
2. 명령어 뒤에 검색하고 싶은 에너지뉴스 키워드를 작성합니다.
3. Enter 키를 누르거나 전송 버튼을 클릭합니다.
4. 스트리밍 방식으로 실시간으로 결과가 표시됩니다.

**예시:**
```
/energynews 최근 신재생에너지 뉴스
/energynews 태양광 발전소 건설
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

### TBM 워크플로우 실행

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

### Energy News 워크플로우 실행

- **경로**: `/api/energynews/workflow`
- **메서드**: `POST`
- **요청**: JSON
  ```json
  {
    "query": "검색 키워드",
    "mode": "streaming"
  }
  ```
- **응답**: SSE 스트리밍 응답 (마크다운 형식)

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
- ✅ `/energynews` 명령어 인식 및 처리
- ✅ 이미지 파일 업로드 및 첨부 (TBM 전용)
- ✅ MISO 워크플로우 실행 (블로킹/스트리밍 모드)
- ✅ 마크다운 형식 결과 표시
- ✅ 실시간 스트리밍 응답 표시 (Energy News)
- ✅ 에러 처리 및 사용자 피드백
- ✅ 로딩 상태 표시

## 주의사항

- 이미지 파일은 최대 10MB까지 업로드 가능합니다 (TBM 전용).
- 이미지 파일만 첨부 가능합니다 (JPG, PNG, GIF 등).
- **각 기능은 별도의 API 키가 필요합니다:**
  - TBM: `MISO_API_KEY`
  - Energy News: `ENERGYNEWS_API_KEY`
  - AnGenBot: `ANGENBOT_API_KEY`
- 해당 API 키가 설정되지 않으면 각 기능이 동작하지 않습니다.

