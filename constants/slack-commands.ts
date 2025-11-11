export type SlackCommand = {
  id: string
  title: string
  description?: string
  appName: string
  icon: string // emoji or icon identifier or image URL
  action: string // the actual command that gets inserted
}

export const SLACK_COMMANDS: SlackCommand[] = [
  {
    id: 'generate-tbm-docs',
    title: 'Generate TBM Docs (안젠봇)',
    appName: 'MISO',
    icon: '/assets/anjenbot_avatar.png', // 안젠봇 아바타 이미지 사용
    action: '/tbm',
  },
]

