export function SlackHeader() {
  return (
    <header className="border-b" style={{ borderColor: "var(--slack-border)", backgroundColor: "var(--slack-bg)" }}>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#007A5A] rounded flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <h1 className="font-bold text-base" style={{ color: "var(--slack-text)" }}>
              PLAI MAKER
            </h1>
          </div>
          <span className="text-sm" style={{ color: "var(--slack-text-muted)" }}>
            | #general
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm rounded hover:bg-[#F8F9FA]" style={{ color: "var(--slack-text-muted)" }}>
            Members
          </button>
        </div>
      </div>
    </header>
  )
}
