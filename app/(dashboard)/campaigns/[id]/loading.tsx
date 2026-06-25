function Sk({ className }: { className: string }) {
  return <div className={`bg-[#262626] rounded animate-pulse ${className}`} />
}

export default function CampaignDetailLoading() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Sk className="w-5 h-5 rounded" />
        <div className="flex-1 space-y-1.5">
          <Sk className="h-7 w-48" />
          <Sk className="h-4 w-64" />
        </div>
        <Sk className="h-9 w-28 rounded-xl" />
      </div>

      {/* Brief card */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-6">
        <Sk className="h-4 w-36 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Sk key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>

      {/* Videos */}
      <Sk className="h-4 w-28 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
            <div className="space-y-1.5">
              <Sk className="h-4 w-32" />
              <Sk className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Sk className="h-3 w-20" />
              <Sk className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
