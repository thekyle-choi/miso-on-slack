"use client"

import { Users } from "lucide-react"

interface ChannelWelcomeProps {
  channelName: string
  onChannelChange?: (channel: string) => void
}

export function ChannelWelcome({ channelName, onChannelChange }: ChannelWelcomeProps) {
  return (
    <div className="flex flex-col h-full px-8 py-12">
      <div className="max-w-2xl w-full">
        {/* 환영 제목 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
          #MISO on Slack
        </h1>
        <p className="text-gray-600 mb-8 text-left">
          아래의 버튼을 클릭하여 miso가 연동된 usecase를 확인해보세요!
        </p>

        {/* 카드들 */}
        <div className="grid grid-cols-3 gap-4">
          {/* PLAI MAKER */}
          <div className="bg-[#E0F5F5] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                PLAI MAKER
              </div>
              <div className="text-xs text-gray-600">
                아이디어 구체화 및 앱생성
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

          {/* 안전 작업 TBM */}
          <div 
            onClick={() => onChannelChange?.("gs-52g-powerplant-tbm")}
            className="bg-[#FFE8D1] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                안전 작업 TBM
              </div>
              <div className="text-xs text-gray-600">
                작업기반방법 문서 생성
              </div>
            </div>
            <div className="mt-auto flex justify-center">
              <img 
                src="/assets/tbm.png" 
                alt="안전 작업 TBM" 
                className="h-40 w-full max-w-[200px] object-contain object-bottom"
              />
            </div>
          </div>

          {/* 디자인 리스크 체크 에이전트 */}
          <div 
            onClick={() => onChannelChange?.("gs-52g-design-group")}
            className="bg-[#F4E4FF] rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
          >
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                디자인 리스크 체크 에이전트
              </div>
              <div className="text-xs text-gray-600">
                디자인 시안 리스크 점검
              </div>
            </div>
            <div className="mt-auto flex justify-center">
              <img 
                src="/assets/design-risk.png" 
                alt="디자인 리스크 체크 에이전트" 
                className="h-40 w-full max-w-[200px] object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

