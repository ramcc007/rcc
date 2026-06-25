function Sk({ className }: { className: string }) {
  return <div className={`bg-[#262626] rounded animate-pulse ${className}`} />
}

export default function LibraryLoading() {
  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <Sk className="h-7 w-40" />
        <Sk className="h-9 w-32 rounded-xl" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Sk className="h-9 flex-1 min-w-[200px] rounded-xl" />
        <Sk className="h-9 w-36 rounded-xl" />
        <Sk className="h-9 w-36 rounded-xl" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <Sk className="aspect-video w-full rounded-none" />
            <div className="p-3 space-y-2">
              <Sk className="h-4 w-3/4" />
              <Sk className="h-3 w-1/2" />
              <div className="flex gap-2">
                <Sk className="h-4 w-14 rounded" />
                <Sk className="h-4 w-10 rounded" />
                <Sk className="h-4 w-10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
