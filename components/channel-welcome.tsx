"use client"

import { Users } from "lucide-react"

interface ChannelWelcomeProps {
  channelName: string
  onChannelChange?: (channel: string) => void
}

export function ChannelWelcome({ channelName, onChannelChange }: ChannelWelcomeProps) {
  return (
    <div className="flex flex-col h-full px-8 py-12">
      <div className="w-full">
        {/* 환영 제목 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
          #MISO on Slack
        </h1>
        <p className="text-gray-600 mb-8 text-left">
          Click the buttons below to explore use cases integrated with MISO!
        </p>

        {/* 카드들 */}
        <div className="grid grid-cols-4 gap-6">
          {/* PLAI MAKER */}
          <div 
            onClick={() => onChannelChange?.("plai-maker")}
            className="bg-cyan-50 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full min-h-[280px]"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                PLAI MAKER
              </div>
              <div className="text-xs text-gray-600">
                App creation assistant agent
              </div>
            </div>
            <div className="mt-auto flex justify-center">
              <img 
                src="/assets/plai-maker-main.png" 
                alt="PLAI MAKER" 
                className="h-40 w-full max-w-[200px] object-contain object-bottom"
              />
            </div>
          </div>

          {/* 안젠봇 (Safety Bot) */}
          <div 
            onClick={() => onChannelChange?.("anjenbot-safety-bot")}
            className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full min-h-[280px]"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                AnGenBot (Safety Bot)
              </div>
              <div className="text-xs text-gray-600">
                Safety regulation agent
              </div>
            </div>
            <div className="mt-auto flex justify-center overflow-hidden h-36">
              <img 
                src="/assets/anGenbot.png" 
                alt="AnGenBot" 
                className="w-full max-w-[200px] h-full object-cover object-top"
              />
            </div>
          </div>

          {/* 에너지 뉴스 클리핑 */}
          <div 
            onClick={() => onChannelChange?.("gs-52g-powerplant-tbm")}
            className="bg-orange-50 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full min-h-[280px]"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                Energy News Clipping
              </div>
              <div className="text-xs text-gray-600">
                News collection agent
              </div>
            </div>
            <div className="mt-auto flex justify-center overflow-hidden h-36">
              <img 
                src="/assets/energynews.png" 
                alt="Energy News Clipping" 
                className="w-full max-w-[200px] h-full object-cover object-top"
              />
            </div>
          </div>

          {/* 디자인 리스크 체크 */}
          <div 
            onClick={() => onChannelChange?.("gs-52g-design-group")}
            className="bg-purple-50 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full min-h-[280px]"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                Design Risk Check
              </div>
              <div className="text-xs text-gray-600">
                Design review agent
              </div>
            </div>
            <div className="mt-auto flex justify-center">
              <img 
                src="/assets/design-risk.png" 
                alt="Design Risk Check" 
                className="h-40 w-full max-w-[200px] object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

