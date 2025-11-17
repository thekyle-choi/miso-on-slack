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
    title: 'Generate TBM Docs (anGenbot)',
    appName: 'MISO',
    icon: '/assets/anjenbot_avatar.png', // anGenbot 아바타 이미지 사용
    action: '/tbm',
  },
  {
    id: 'energy-news-scraping',
    title: 'Energy News Scraping',
    appName: 'MISO',
    icon: '/assets/energynews.png',
    action: '/energynews',
  },
  {
    id: 'design-risk-assessment',
    title: 'Design Risk Assessment',
    appName: 'MISO',
    icon: '/assets/design-risk.png',
    action: '/designrisk',
  },
]

