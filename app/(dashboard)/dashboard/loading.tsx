function Sk({ className }: { className: string }) {
  return <div className={`bg-[#262626] rounded animate-pulse ${className}`} />
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-6xl animate-pulse">
      {/* Welcome */}
      <div className="space-y-2">
        <Sk className="h-7 w-56" />
        <Sk className="h-4 w-80" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sk className="w-4 h-4 rounded" />
              <Sk className="h-3 w-20" />
            </div>
            <Sk className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Promo banner */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-3">
        <Sk className="h-5 w-36" />
        <Sk className="h-4 w-full max-w-lg" />
        <Sk className="h-4 w-3/4 max-w-lg" />
        <Sk className="h-9 w-40 rounded-xl mt-2" />
      </div>

      {/* Recent campaigns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Sk className="h-5 w-40" />
          <Sk className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
              <div className="space-y-1.5">
                <Sk className="h-4 w-48" />
                <Sk className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
