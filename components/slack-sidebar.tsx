"use client"

import { ChevronDown, Plus, Hash, Star, Edit2, MessageSquare, Mail, FileText, AtSign, Bookmark, MoreHorizontal, Home, Users, Settings, Smile } from "lucide-react"
import Image from "next/image"

export function SlackSidebar() {
  return (
    <div className="w-[260px] h-full bg-[#4A154B] text-white flex flex-col">
      {/* Workspace Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1.5 flex-1">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1.5 shrink-0">
              <Image 
                src="/assets/52g_logo.svg" 
                alt="52G Logo" 
                width={32} 
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-[18px] truncate">52g</span>
            <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded ml-1">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {/* Main Navigation */}
        <div className="mb-4">
          <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white">
            <Smile className="w-4 h-4" />
            <span>Get Started</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white">
            <MessageSquare className="w-4 h-4" />
            <span>Threads</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white">
            <Users className="w-4 h-4" />
            <span>Huddles</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Drafts & Sent</span>
            </div>
            <span className="text-xs text-white/50">1</span>
          </button>
          <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-white/10 rounded w-full text-sm text-white/90 hover:text-white">
            <Users className="w-4 h-4" />
            <span>Directory</span>
          </button>
        </div>

        {/* Favorites Section */}
        <div className="mb-4">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white/70 font-semibold">Favorites</span>
          </button>
          <div className="text-sm text-white/50 px-2 py-2">
            Add frequently used channels and messages for easy access
          </div>
        </div>

        {/* External Connections Section */}
        <div className="mb-4">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-1">
            <ChevronDown className="w-4 h-4" />
            <span className="text-white/70 font-semibold">External Connections</span>
          </button>
          <div className="space-y-0.5">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              </svg>
              <span className="truncate">gs-graphon</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 bg-[#1164A3] rounded w-full text-sm text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              </svg>
              <span className="truncate">gs-holdings-52g-salesforce-sla...</span>
            </button>
          </div>
        </div>

        {/* Channels Section */}
        <div className="mb-4">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-1">
            <ChevronDown className="w-4 h-4" />
            <span className="text-white/70 font-semibold">Channels</span>
          </button>
          <div className="space-y-0.5">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <Hash className="w-4 h-4" />
              <span>52g</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <Hash className="w-4 h-4" />
              <span>random</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <Hash className="w-4 h-4" />
              <span>general</span>
            </button>
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="mb-4">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm mb-1">
            <ChevronDown className="w-4 h-4" />
            <span className="text-white/70 font-semibold">Direct Messages</span>
          </button>
          <div className="space-y-0.5">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-pink-400"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#4A154B]"></div>
              </div>
              <span className="truncate">Ally Kim 52g</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-purple-400"></div>
              <span>Zoey(Lee)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-blue-400"></div>
              <span>keaton</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-green-400"></div>
              <span>Heather</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-yellow-400"></div>
              <span>Jin(Lee)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-red-400"></div>
              <span>Bob(Park)</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded w-full text-sm text-white/70 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-indigo-400"></div>
              <span>Julie Park</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1.5 flex-1">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-blue-500"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#4A154B]"></div>
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium text-white truncate">User Name</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-white/70">Active</span>
              </div>
            </div>
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
