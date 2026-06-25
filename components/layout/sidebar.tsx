'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  PlusCircle,
  Megaphone,
  Library,
  Palette,
  Settings,
  Video,
  Sparkles,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create Video', icon: PlusCircle, highlight: true },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/library', label: 'Video Library', icon: Library },
  { href: '/brand-kit', label: 'Brand Kit', icon: Palette },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-[#141414] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">UGC Pro Studio</p>
            <p className="text-xs text-[#a3a3a3]">Powered by Gemini</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                item.highlight && !isActive && 'bg-violet-600/10 text-violet-400 hover:bg-violet-600/20',
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                  : !item.highlight && 'text-[#a3a3a3] hover:text-white hover:bg-[#262626]'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.highlight && !isActive && (
                <Sparkles className="w-3 h-3 ml-auto text-violet-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <p className="text-xs text-[#555] text-center">UGC Pro Studio v1.0</p>
      </div>
    </aside>
  )
}
