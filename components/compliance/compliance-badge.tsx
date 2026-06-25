import { Shield, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComplianceBadgeProps {
  badge: 'compliant' | 'needs-review' | 'non-compliant'
  score?: number
  size?: 'sm' | 'md'
}

export function ComplianceBadge({ badge, score, size = 'md' }: ComplianceBadgeProps) {
  const configs = {
    compliant: {
      icon: Shield,
      label: 'Compliant',
      className: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    'needs-review': {
      icon: AlertTriangle,
      label: 'Needs Review',
      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    },
    'non-compliant': {
      icon: XCircle,
      label: 'Non-Compliant',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
  }

  const { icon: Icon, label, className } = configs[badge]

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 border rounded-full font-medium',
      className,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
      {score !== undefined && <span className="opacity-60">·{score}</span>}
    </span>
  )
}
