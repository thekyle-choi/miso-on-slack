"use client"

import Image from "next/image"
import { 
  HiHome, 
  HiChatAlt2, 
  HiBell, 
  HiDocumentText, 
  HiDotsHorizontal,
  HiPlus
} from "react-icons/hi"

export function WorkspaceSwitcher() {
  return (
    <div className="w-[68px] h-full bg-[#3F0E40] flex flex-col items-center py-2 gap-0">
      {/* Active Workspace */}
      <button className="relative w-[36px] h-[36px] rounded-lg bg-white hover:rounded-xl transition-all duration-200 group overflow-hidden mt-1 mb-2">
        <Image 
          src="/assets/52g_logo.svg" 
          alt="52G Workspace" 
          width={36} 
          height={36}
          className="w-full h-full object-contain p-1.5"
        />
      </button>

      {/* Divider */}
      <div className="w-8 h-[1px] bg-white/20 my-2"></div>

      {/* Navigation Icons */}
      <button className="w-full h-12 flex items-center justify-center mt-1">
        <div className="w-11 h-11 flex flex-col items-center justify-center bg-white/20 rounded-md text-white">
          <HiHome className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">홈</span>
        </div>
      </button>

      <button className="w-full h-12 flex items-center justify-center mt-1 group">
        <div className="w-11 h-11 flex flex-col items-center justify-center group-hover:bg-white/10 rounded-md transition-colors text-white/70 group-hover:text-white">
          <HiChatAlt2 className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">DM</span>
        </div>
      </button>

      <button className="w-full h-12 flex items-center justify-center mt-1 group">
        <div className="w-11 h-11 flex flex-col items-center justify-center group-hover:bg-white/10 rounded-md transition-colors text-white/70 group-hover:text-white">
          <HiBell className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">내 활동</span>
        </div>
      </button>

      <button className="w-full h-12 flex items-center justify-center mt-1 group">
        <div className="w-11 h-11 flex flex-col items-center justify-center group-hover:bg-white/10 rounded-md transition-colors text-white/70 group-hover:text-white">
          <HiDocumentText className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">파일</span>
        </div>
      </button>

      <button className="w-full h-12 flex items-center justify-center mt-1 group">
        <div className="w-11 h-11 flex flex-col items-center justify-center group-hover:bg-white/10 rounded-md transition-colors text-white/70 group-hover:text-white">
          <HiDotsHorizontal className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">더보기</span>
        </div>
      </button>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Add Button */}
      <button className="w-[36px] h-[36px] rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white/70 hover:text-white group">
        <HiPlus className="w-5 h-5" />
      </button>

      {/* User Profile */}
      <button className="w-[36px] h-[36px] rounded-lg overflow-hidden mb-1 hover:opacity-80 transition-opacity ring-2 ring-transparent hover:ring-white/50">
        <Image 
          src="/assets/mini_kyle_default.png" 
          alt="Profile" 
          width={36} 
          height={36}
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  )
}

