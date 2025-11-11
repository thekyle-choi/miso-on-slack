"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ArrowRight, RotateCw, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BrowserWindowProps {
  isOpen: boolean
  onClose: () => void
  defaultUrl?: string
}

type Tab = {
  id: string
  url: string
  title: string
}

export function BrowserWindow({ 
  isOpen, 
  onClose, 
  defaultUrl = "https://www.52g.gs" 
}: BrowserWindowProps) {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "1", url: defaultUrl, title: "52g" }])
  const [activeTabId, setActiveTabId] = useState("1")
  const [inputUrl, setInputUrl] = useState(defaultUrl)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map())
  const historyRefs = useRef<Map<string, { urls: string[]; index: number }>>(new Map())
  
  const activeTab = tabs.find(tab => tab.id === activeTabId)
  const currentUrl = activeTab?.url || defaultUrl

  // 브라우저가 열릴 때 defaultUrl로 초기화
  useEffect(() => {
    if (isOpen) {
      // 브라우저가 새로 열릴 때마다 첫 번째 탭을 defaultUrl로 리셋
      setTabs([{ id: "1", url: defaultUrl, title: "52g" }])
      setActiveTabId("1")
      setInputUrl(defaultUrl)
      historyRefs.current.clear()
      historyRefs.current.set("1", { urls: [defaultUrl], index: 0 })
      iframeRefs.current.clear()
    }
  }, [isOpen, defaultUrl])

  useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url)
      const history = historyRefs.current.get(activeTabId)
      if (history) {
        setCanGoBack(history.index > 0)
        setCanGoForward(history.index < history.urls.length - 1)
      }
    }
  }, [activeTabId, activeTab])

  const handleNavigate = (url: string, tabId: string = activeTabId) => {
    // URL 유효성 검사 및 정규화
    let normalizedUrl = url.trim()
    if (!normalizedUrl) return

    // http:// 또는 https://가 없으면 추가
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl
    }

    // 히스토리 업데이트
    const history = historyRefs.current.get(tabId) || { urls: [defaultUrl], index: 0 }
    history.urls = history.urls.slice(0, history.index + 1)
    history.urls.push(normalizedUrl)
    history.index = history.urls.length - 1
    historyRefs.current.set(tabId, history)

    // 탭 업데이트
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, url: normalizedUrl } : tab
    ))
    setInputUrl(normalizedUrl)
    setCanGoBack(history.index > 0)
    setCanGoForward(false)
  }

  const handleGoBack = () => {
    const history = historyRefs.current.get(activeTabId)
    if (!history || history.index <= 0) return

    history.index--
    const url = history.urls[history.index]
    
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, url } : tab
    ))
    setInputUrl(url)
    setCanGoBack(history.index > 0)
    setCanGoForward(true)
  }

  const handleGoForward = () => {
    const history = historyRefs.current.get(activeTabId)
    if (!history || history.index >= history.urls.length - 1) return

    history.index++
    const url = history.urls[history.index]
    
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, url } : tab
    ))
    setInputUrl(url)
    setCanGoBack(true)
    setCanGoForward(history.index < history.urls.length - 1)
  }

  const handleRefresh = () => {
    const iframe = iframeRefs.current.get(activeTabId)
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  const handleNewTab = () => {
    const newTabId = String(Date.now())
    const newTab: Tab = { id: newTabId, url: defaultUrl, title: "새 탭" }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
    historyRefs.current.set(newTabId, { urls: [defaultUrl], index: 0 })
    setInputUrl(defaultUrl)
  }

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (tabs.length === 1) {
      onClose()
      return
    }
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId)
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    
    if (tabId === activeTabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)]
      setActiveTabId(newActiveTab.id)
    }
    
    historyRefs.current.delete(tabId)
    iframeRefs.current.delete(tabId)
  }

  const handleIframeLoad = (tabId: string) => {
    const iframe = iframeRefs.current.get(tabId)
    if (iframe) {
      try {
        const title = iframe.contentDocument?.title || "새 탭"
        setTabs(prev => prev.map(tab => 
          tab.id === tabId ? { ...tab, title } : tab
        ))
      } catch (e) {
        // Cross-origin 제한으로 인한 오류 무시
      }
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleNavigate(inputUrl)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // 오버레이 클릭 시 닫기
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS 윈도우 컨트롤 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="닫기"
            />
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"
              aria-label="최소화"
            />
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
              aria-label="최대화"
            />
          </div>
        </div>

        {/* 탭 바 */}
        <div className="flex items-end gap-1 px-2 pt-2 bg-gray-50 border-b border-gray-200 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-colors min-w-[200px] ${
                activeTabId === tab.id
                  ? "bg-white border-t border-l border-r border-gray-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="flex-1 text-sm truncate text-gray-700">{tab.title}</span>
              <button
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-300 rounded"
              >
                <X className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          ))}
          <button
            onClick={handleNewTab}
            className="px-3 py-2 rounded-t-lg hover:bg-gray-200 transition-colors mb-0.5"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* 브라우저 툴바 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200 shrink-0">
          {/* 네비게이션 버튼들 */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              disabled={!canGoBack}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoForward}
              disabled={!canGoForward}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* 주소창 (Chrome 스타일) */}
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onBlur={() => setInputUrl(currentUrl)}
                className="w-full h-9 px-4 pr-10 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                placeholder="검색 또는 URL 입력"
              />
              {inputUrl && (
                <button
                  type="button"
                  onClick={() => setInputUrl("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* iframe 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden bg-white">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`w-full h-full ${activeTabId === tab.id ? "block" : "hidden"}`}
            >
              <iframe
                ref={(el) => {
                  if (el) {
                    iframeRefs.current.set(tab.id, el)
                  } else {
                    iframeRefs.current.delete(tab.id)
                  }
                }}
                src={tab.url}
                className="w-full h-full border-0"
                title={tab.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                onLoad={() => handleIframeLoad(tab.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

