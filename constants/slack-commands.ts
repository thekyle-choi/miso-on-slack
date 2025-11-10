export type SlackCommand = {
  id: string
  title: string
  description?: string
  appName: string
  icon: string // emoji or icon identifier
  action: string // the actual command that gets inserted
}

export const SLACK_COMMANDS: SlackCommand[] = [
  {
    id: 'generate-tbm-docs',
    title: 'Generate TBM Docs (안젠봇)',
    appName: 'MISO',
    icon: '🤖',
    action: '/tbm',
  },
]

