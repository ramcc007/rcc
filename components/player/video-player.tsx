'use client'
import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  src: string
  aspectRatio?: '9:16' | '16:9' | '1:1'
  className?: string
}

export function VideoPlayer({ src, aspectRatio = '9:16', className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause() } else { v.play() }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    v.currentTime = pct * v.duration
  }

  const aspectClasses = {
    '9:16': 'aspect-[9/16] max-w-[280px]',
    '16:9': 'aspect-video w-full',
    '1:1': 'aspect-square max-w-sm',
  }

  return (
    <div className={cn('bg-black rounded-xl overflow-hidden group relative mx-auto', aspectClasses[aspectRatio], className)}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        playsInline
      />

      {/* Controls overlay */}
      <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 via-transparent to-transparent">
        {/* Seek bar */}
        <div
          className="mx-3 mb-2 h-1 bg-white/20 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-1 bg-violet-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <button onClick={togglePlay} className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
            {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>
          <button onClick={toggleMute} className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
            {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
          <div className="flex-1" />
          <a
            href={src}
            download
            className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Play button when paused */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  )
}
