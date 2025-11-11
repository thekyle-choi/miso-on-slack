// 아바타 이미지 경로 매핑
// 각 인물별로 고유한 아바타 이미지를 지정할 수 있습니다.
// 이미지는 public/assets/ 폴더에 저장하고, 여기서 경로를 지정하세요.

export const AVATARS: Record<string, string> = {
  // 안젠봇 (TBM 문서 생성 봇)
  "안젠봇": "/assets/anjenbot_avatar.png",
  
  // TBM 채널 인물들 - 로컬 이미지 사용
  "James Park(Maintenance)": "/assets/avatar_park_minsu.jpg",
  "Mike Kim(Team Lead)": "/assets/avatar_kim_chulsoo.jpg",
  "Sarah Lee(Safety)": "/assets/avatar_lee_younghee.jpg",
  "David Choi(Electrical)": "/assets/avatar_choi_daehyun.jpg",
  
  // 디자인 그룹 채널 인물들
  "Jessica Park(Designer)": "/assets/avatar_park_jieun.jpg",
  "Michael Kim(Team Lead)": "/assets/avatar_kim_minsu.jpg",
  "Daniel Lee(Design QA)": "/assets/avatar_lee_hyunwoo.jpg",
  
  // 다이렉트 메시지 인물들
  "Ally": "/assets/avatar_ally.jpg",
  "Zoey": "/assets/avatar_zoey.jpg",
  "Young": "/assets/avatar_young.jpg",
  "Leo": "/assets/avatar_leo.jpg",
  "Ian": "/assets/avatar_ian.jpg",
  
  // 기본 채널 인물들
  "Leo(Heo Youngsu)": "/assets/mini_kyle_default.jpg",
  "Sungeun Im": "/assets/mini_ally_default.jpg",
  
  // 기본값
  "default": "/assets/mini_kyle_default.jpg",
}

// 아바타 경로 가져오기 함수
export function getAvatar(sender: string): string {
  return AVATARS[sender] || AVATARS["default"] || "/placeholder.svg"
}

