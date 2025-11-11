import { getAvatar } from "./avatars"

export interface Message {
  sender: string
  time: string
  content: string
  avatar: string
  isBot?: boolean
  isUpdate?: boolean
  badge?: string
  reactions?: Array<{ emoji: string; count: number }>
  event?: {
    title: string
    emoji: string
    time: string
  }
  attachment?: {
    type: string
    title: string
    subtitle: string
  }
  isLoading?: boolean
  misoResult?: string // MISO 워크플로우 결과 저장
  taskId?: string // 작업 추적을 위한 고유 ID
}

export const MOCK_MESSAGES: Message[] = [
  {
    sender: "Channel Update Team",
    time: "AM 10:03",
    content: "Kyle(Team Lead) has updated 📘 MISO Usecase.",
    avatar: "/placeholder.svg",
    isBot: true,
    isUpdate: true,
  },
  {
    sender: "Leo(Heo Youngsu)",
    time: "PM 2:37",
    content:
      "Hello, MISO is a development tool I am responsible for at (주)GS Heo Youngsu.\nThis project manages MISO API definitions and use cases, allowing you to manage available app endpoints and example codes.\nPlease feel free to reach out if you have any questions about using it~",
    avatar: "/assets/mini_kyle_default.jpg",
    reactions: [
      { emoji: "🤓", count: 2 },
      { emoji: "👍", count: 1 },
      { emoji: "✅", count: 1 },
    ],
  },
  {
    sender: "Channel Update Team",
    time: "PM 2:40",
    content: "Ian(Kim Wonhak) and Leo(Heo Youngsu) have updated 📘 MISO Usecase.",
    avatar: "/placeholder.svg",
    isBot: true,
    isUpdate: true,
  },
  {
    sender: "Sungeun Im",
    time: "PM 2:41",
    content:
      "@Leo(Heo Youngsu) Thank you for your hard work! :-) @Tony Song @Hyeonji Kim @Dahae Joo @Insun Son Thank you all for your contributions",
    avatar: "/assets/mini_ally_default.jpg",
    reactions: [
      { emoji: "❤️", count: 1 },
      { emoji: "✅", count: 1 },
    ],
  },
  {
    sender: "Leo(Heo Youngsu)",
    time: "PM 2:41",
    content:
      "No need to be discouraged. I'll definitely get it right this time. I'll work hard on the meeting too.",
    avatar: "/assets/mini_kyle_default.jpg",
    reactions: [
      { emoji: "👍", count: 1 },
      { emoji: "✅", count: 1 },
    ],
  },
  {
    sender: "Sungeun Im",
    time: "PM 2:43",
    content: "Thank you! We will definitely refer to it when implementing external services @Jina Park",
    avatar: "/assets/mini_ally_default.jpg",
  },
]

// 발전소 작업 관련 목업 메시지
export const POWERPLANT_MOCK_MESSAGES: Message[] = [
  {
    sender: "Channel Update Team",
    time: "AM 8:30",
    content: "Maintenance Team has reported 🔧 Motor failure in Boiler Confined Space.",
    avatar: "/placeholder.svg",
    isBot: true,
    isUpdate: true,
  },
  {
    sender: "James Park(Maintenance)",
    time: "AM 8:35",
    content:
      "⚠️ URGENT: Motor failure detected in the boiler confined space (Unit 3).\nThe motor stopped responding during routine inspection. Initial assessment shows bearing failure and possible electrical issues. Immediate action required.",
    avatar: getAvatar("James Park(Maintenance)"),
    reactions: [
      { emoji: "⚠️", count: 3 },
      { emoji: "🔧", count: 2 },
    ],
  },
  {
    sender: "Mike Kim(Team Lead)",
    time: "AM 8:45",
    content:
      "@James Park(Maintenance) @Sarah Lee(Safety) @David Choi(Electrical) \n\n**WORK ORDER ASSIGNED**\n\n**Task:** Motor repair/replacement in Boiler Confined Space (Unit 3)\n**Priority:** High\n**Scheduled Time:** Today 2:00 PM\n**Assigned Team:** Maintenance Crew A (5 members)\n\n**Initial Requirements:**\n- Confined space entry permit\n- Gas detection before entry\n- Ventilation system check\n- PPE and safety equipment\n- Safety observer required\n\nPlease coordinate and prepare accordingly.",
    avatar: getAvatar("Mike Kim(Team Lead)"),
    reactions: [
      { emoji: "✅", count: 4 },
      { emoji: "👍", count: 2 },
    ],
  },
  {
    sender: "Sarah Lee(Safety)",
    time: "AM 8:50",
    content:
      "@Mike Kim(Team Lead) Confirmed. I'll prepare the confined space entry permit and coordinate gas detection equipment. Safety team will be ready by 1:30 PM.",
    avatar: getAvatar("Sarah Lee(Safety)"),
    reactions: [
      { emoji: "✅", count: 2 },
    ],
  },
  {
    sender: "David Choi(Electrical)",
    time: "AM 8:55",
    content:
      "@Mike Kim(Team Lead) Understood. I'll coordinate power isolation for Unit 3 boiler area. Electrical lockout/tagout will be completed by 1:45 PM.",
    avatar: getAvatar("David Choi(Electrical)"),
    reactions: [
      { emoji: "✅", count: 2 },
    ],
  },
  {
    sender: "James Park(Maintenance)",
    time: "AM 9:00",
    content:
      "@Mike Kim(Team Lead) Received. Maintenance Crew A is reviewing the motor specifications and preparing equipment list:\n- Replacement motor (Model: ABB M2BA 132S-4)\n- Hoisting equipment for confined space\n- Tool inspection in progress\n\nWe'll be ready for the 2:00 PM start time.",
    avatar: getAvatar("James Park(Maintenance)"),
    reactions: [
      { emoji: "✅", count: 3 },
      { emoji: "🔧", count: 1 },
    ],
  },
  {
    sender: "Mike Kim(Team Lead)",
    time: "AM 9:15",
    content:
      "@James Park(Maintenance) @Sarah Lee(Safety) @David Choi(Electrical)\n\n**IMPORTANT:** Before proceeding with the work, please prepare a **TBM (Task-Based Method) document** for this confined space motor repair task.\n\nThe TBM should include:\n- Detailed work procedures\n- Safety protocols specific to confined space entry\n- Step-by-step task sequence\n- Risk assessment and mitigation measures\n- Equipment and tool requirements\n- Emergency response procedures\n\nPlease complete the TBM document preparation before the pre-work briefing at 1:30 PM. This is mandatory for confined space operations.",
    avatar: getAvatar("Mike Kim(Team Lead)"),
    reactions: [
      { emoji: "📋", count: 3 },
      { emoji: "✅", count: 2 },
    ],
  },
  {
    sender: "James Park(Maintenance)",
    time: "AM 9:20",
    content:
      "@Mike Kim(Team Lead) Understood. We'll prepare the TBM document immediately. I'll coordinate with the team to gather all necessary information and create a comprehensive task-based method document for this confined space motor repair operation.",
    avatar: getAvatar("James Park(Maintenance)"),
    reactions: [
      { emoji: "✅", count: 2 },
    ],
  },
]

// 디자인 그룹 관련 목업 메시지
export const DESIGN_GROUP_MOCK_MESSAGES: Message[] = [
  {
    sender: "Channel Update Team",
    time: "AM 10:15",
    content: "Design Team has uploaded a new poster design.",
    avatar: "/placeholder.svg",
    isBot: true,
    isUpdate: true,
  },
  {
    sender: "Jessica Park(Designer)",
    time: "AM 10:20",
    content:
      "Hello! I've completed the new poster design for this weekend's event. Please review.",
    avatar: getAvatar("Jessica Park(Designer)"),
    reactions: [
      { emoji: "👍", count: 2 },
      { emoji: "👀", count: 1 },
    ],
  },
  {
    sender: "Michael Kim(Team Lead)",
    time: "AM 10:35",
    content:
      "@Jessica Park(Designer) @Daniel Lee(Design QA)\n\nHas the risk check for the poster design that was in progress been completed?\n\nPlease verify through the Design Risk Check Agent.",
    avatar: getAvatar("Michael Kim(Team Lead)"),
    reactions: [
      { emoji: "✅", count: 1 },
    ],
  },
  {
    sender: "Daniel Lee(Design QA)",
    time: "AM 10:40",
    content:
      "@Michael Kim(Team Lead) Understood. I'll proceed with the risk check for the poster design through the Design Risk Check Agent.",
    avatar: getAvatar("Daniel Lee(Design QA)"),
    reactions: [
      { emoji: "✅", count: 1 },
    ],
  },
]

// 일반 채널 빈 메시지 (초기 환영 화면)
export const GENERAL_CHANNEL_MESSAGES: Message[] = []

// 채널별 목업 메시지 맵
export const CHANNEL_MOCK_MESSAGES: Record<string, Message[]> = {
  "일반": GENERAL_CHANNEL_MESSAGES,
  "gs-holdings-52g-salesforce-slack": MOCK_MESSAGES,
  "gs-graphon": MOCK_MESSAGES,
  "gs-52g-powerplant-tbm": POWERPLANT_MOCK_MESSAGES,
  "gs-52g-design-group": DESIGN_GROUP_MOCK_MESSAGES,
}

