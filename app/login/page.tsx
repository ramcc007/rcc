import { LoginCard } from '@/components/auth/login-card'
import { Video, Sparkles, Shield, Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-16 bg-gradient-to-br from-violet-950 via-[#0f0f0f] to-[#0f0f0f]">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UGC Pro Studio</h1>
              <p className="text-xs text-violet-300">Powered by Gemini Veo 3</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Professional UGC videos,<br />
            <span className="text-violet-400">generated in seconds</span>
          </h2>
          <p className="text-[#a3a3a3] mb-10 text-lg">
            Connect your Gemini Pro account to generate hook-first UGC scripts, create AI characters, and produce platform-ready videos with built-in compliance.
          </p>

          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'AI script generation with 40+ creative filters' },
              { icon: Zap, text: 'Veo 3 video generation — 9:16, 16:9, 1:1 formats' },
              { icon: Shield, text: 'FTC compliance checks built in automatically' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-[#d4d4d4] text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginCard />
      </div>
    </div>
  )
}
