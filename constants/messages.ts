import { getAvatar } from "./avatars"

export interface MessageFileAttachment {
  id: string
  name: string
  type: "image" | "document"
  url: string
  mimeType: string
  sizeLabel: string
}

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
  files?: MessageFileAttachment[]
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

// 발전소 관련 목업 메시지
export const POWERPLANT_MOCK_MESSAGES: Message[] = [
  {
    sender: "Mike Kim(Team Lead)",
    time: "AM 9:30",
    content:
      "@Team\n\n**URGENT ASSIGNMENT**\n\nThere have been recent incidents at power plants. I need you to investigate and research news articles related to these power plant accidents.\n\nPlease gather comprehensive information about:\n- Recent power plant accidents and incidents\n- Root causes and contributing factors\n- Safety measures and preventive actions\n- Industry trends and patterns\n- Regulatory responses\n\nThis research is critical for our safety protocols and risk assessment. Please compile your findings and share them in this channel.",
    avatar: getAvatar("Mike Kim(Team Lead)"),
    reactions: [
      { emoji: "📰", count: 3 },
      { emoji: "✅", count: 2 },
    ],
  },
  {
    sender: "Sarah Lee(Safety)",
    time: "AM 9:35",
    content:
      "@Mike Kim(Team Lead) Understood. I'll start researching recent power plant accidents and compile a comprehensive report. I'll focus on identifying common patterns and safety implications.",
    avatar: getAvatar("Sarah Lee(Safety)"),
    reactions: [
      { emoji: "✅", count: 1 },
    ],
  },
  {
    sender: "David Choi(Electrical)",
    time: "AM 9:40",
    content:
      "@Mike Kim(Team Lead) I'll investigate the technical aspects of recent incidents, focusing on electrical failures, equipment malfunctions, and operational issues that may have contributed to these accidents.",
    avatar: getAvatar("David Choi(Electrical)"),
    reactions: [
      { emoji: "✅", count: 1 },
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

// HR Policy Agent 관련 목업 메시지
export const HR_POLICY_MOCK_MESSAGES: Message[] = [
  {
    sender: "HR Policy Agent",
    time: "AM 9:00",
    content:
      "Hello! I'm the HR Policy Agent. I can help you with questions about company policies, employee benefits, leave policies, and HR procedures.\n\nHow can I assist you today?",
    avatar: "/assets/mini_kyle_default.jpg",
    isBot: true,
  },
]

// anGenbot(Safety Bot) 관련 목업 메시지
export const ANJENBOT_SAFETY_MOCK_MESSAGES: Message[] = [
  {
    sender: "AnGenBot(Safety Bot)",
    time: "AM 9:00",
    content:
      "Hello! I'm AnGenBot, your Safety Bot. I can help you with safety protocols, risk assessments, TBM (Task-Based Method) document generation, and workplace safety procedures.\n\nHow can I assist you with safety-related tasks today?",
    avatar: "/assets/anjenbot_avatar.png",
    isBot: true,
  },
]

// 디자인 리스크 에이전트 관련 목업 메시지
export const DESIGN_RISK_AGENT_MOCK_MESSAGES: Message[] = [
  {
    sender: "Design Risk Agent",
    time: "AM 9:00",
    content:
      "Hello! I'm the Design Risk Agent. I analyze creative assets for brand, compliance, and legal risks. Share your design context or provide a link, and I'll highlight potential issues along with mitigation suggestions.",
    avatar: "/assets/design-risk.png",
    isBot: true,
  },
]

// PLAI MAKER 관련 목업 메시지
export const PLAI_MAKER_MOCK_MESSAGES: Message[] = [
  {
    sender: "PLAI MAKER",
    time: "AM 9:00",
    content:
      "Hello! We are team PLAI MAKER. I can help you transform your ideas into concrete app prototypes and assist with app generation.\n\nHow can I help you bring your ideas to life today?",
    avatar: "/assets/plai-maker-main.png",
    isBot: true,
  },
]

// 일반 채널 빈 메시지 (초기 환영 화면)
export const GENERAL_CHANNEL_MESSAGES: Message[] = []

// 빈 채팅창용 메시지
export const EMPTY_CHANNEL_MESSAGES: Message[] = []

// Ally 다이렉트 메시지 목업
export const ALLY_MOCK_MESSAGES: Message[] = [
  {
    sender: "Ally",
    time: "AM 10:00",
    content: "안녕하세요! Ally입니다. 무엇을 도와드릴까요?",
    avatar: getAvatar("Ally"),
  },
]

// Zoey 다이렉트 메시지 목업
export const ZOEY_MOCK_MESSAGES: Message[] = [
  {
    sender: "Zoey",
    time: "AM 10:00",
    content: "안녕하세요! Zoey입니다. 무엇을 도와드릴까요?",
    avatar: getAvatar("Zoey"),
  },
]

// 채널별 목업 메시지 맵
export const CHANNEL_MOCK_MESSAGES: Record<string, Message[]> = {
  "일반": GENERAL_CHANNEL_MESSAGES,
  "gs-holdings-52g-salesforce-slack": MOCK_MESSAGES,
  "gs-graphon": MOCK_MESSAGES,
  "gs-52g-powerplant": POWERPLANT_MOCK_MESSAGES,
  "gs-52g-design-group": DESIGN_GROUP_MOCK_MESSAGES,
  "anjenbot-safety-bot": ANJENBOT_SAFETY_MOCK_MESSAGES,
  "design-risk-agent": DESIGN_RISK_AGENT_MOCK_MESSAGES,
  "hr-policy-agent": HR_POLICY_MOCK_MESSAGES,
  "plai-maker": PLAI_MAKER_MOCK_MESSAGES,
  "ally": ALLY_MOCK_MESSAGES,
  "zoey": ZOEY_MOCK_MESSAGES,
}

