function Sk({ className }: { className: string }) {
  return <div className={`bg-[#262626] rounded animate-pulse ${className}`} />
}

export default function CampaignsLoading() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Sk className="h-7 w-36" />
          <Sk className="h-4 w-24" />
        </div>
        <Sk className="h-9 w-36 rounded-xl" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-5 py-4">
            <div className="flex items-center gap-4">
              <Sk className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <Sk className="h-4 w-40" />
                <Sk className="h-3 w-28" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Sk className="h-5 w-16 rounded-full" />
              <Sk className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
