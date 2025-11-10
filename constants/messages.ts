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

