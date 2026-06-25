import { CheckCircle, XCircle } from 'lucide-react'
import type { QualityReport } from '@/lib/types'
import { getQualityColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface QualityScoreCardProps {
  report: QualityReport
  compact?: boolean
}

const RATING_LABELS = {
  excellent: { label: 'Excellent', color: 'text-green-400' },
  good: { label: 'Good', color: 'text-blue-400' },
  acceptable: { label: 'Acceptable', color: 'text-yellow-400' },
  'needs-regeneration': { label: 'Needs Regen', color: 'text-red-400' },
}

export function QualityScoreCard({ report, compact = false }: QualityScoreCardProps) {
  const rating = RATING_LABELS[report.rating]

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Quality Score</span>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full bg-[#262626]', rating.color)}>
          {rating.label}
        </span>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-4">
        <div className={cn('text-3xl font-bold', getQualityColor(report.score))}>
          {Math.round(report.score)}
        </div>
        <div className="flex-1 bg-[#262626] rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all', report.score >= 80 ? 'bg-green-500' : report.score >= 60 ? 'bg-yellow-500' : 'bg-red-500')}
            style={{ width: `${report.score}%` }}
          />
        </div>
        <span className="text-xs text-[#555]">/100</span>
      </div>

      {!compact && (
        <div className="space-y-2">
          {report.checks.map(check => (
            <div key={check.id} className="flex items-start gap-2">
              {check.passed ? (
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-xs font-medium text-white">{check.label}</span>
                <p className="text-[11px] text-[#555]">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
