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
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create', label: 'Create Video', icon: PlusCircle, highlight: true },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/library', label: 'Video Library', icon: Library },
  { href: '/brand-kit', label: 'Brand Kit', icon: Palette },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <aside className="w-64 h-full bg-[#141414] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">UGC Pro Studio</p>
            <p className="text-xs text-[#a3a3a3]">AI Video Studio</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all',
                item.highlight && !isActive && 'bg-violet-600/10 text-violet-400 hover:bg-violet-600/20',
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                  : !item.highlight && 'text-[#a3a3a3] hover:text-white hover:bg-[#262626]'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
              {item.highlight && !isActive && (
                <Sparkles className="w-3 h-3 ml-auto text-violet-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a2a2a] space-y-2">
        <div className="flex justify-center gap-3 text-xs text-[#555]">
          <Link href="/pricing" onClick={onClose} className="hover:text-[#a3a3a3] transition-colors">Pricing</Link>
          <Link href="/terms" onClick={onClose} className="hover:text-[#a3a3a3] transition-colors">Terms</Link>
          <Link href="/privacy" onClick={onClose} className="hover:text-[#a3a3a3] transition-colors">Privacy</Link>
        </div>
        <p className="text-xs text-[#555] text-center">UGC Pro Studio v1.0</p>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 min-h-screen flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative flex w-64 flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
