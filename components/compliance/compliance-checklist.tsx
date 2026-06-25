import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import type { ComplianceReport } from '@/lib/types'
import { ComplianceBadge } from './compliance-badge'

interface ComplianceChecklistProps {
  report: ComplianceReport
  compact?: boolean
}

export function ComplianceChecklist({ report, compact = false }: ComplianceChecklistProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Compliance</span>
        <ComplianceBadge badge={report.badge} score={report.score} size="sm" />
      </div>

      <div className="space-y-2">
        {report.checks.map(check => (
          <div key={check.id} className="flex items-start gap-2">
            {check.passed ? (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-white">{check.label}</span>
                {check.required && !check.passed && (
                  <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1 rounded">Required</span>
                )}
                <span className="text-[10px] text-[#555]">+{check.points}pts</span>
              </div>
              {!compact && (
                <p className="text-[11px] text-[#555] mt-0.5">{check.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!compact && report.warnings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
          {report.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-yellow-400/80">{warning}</p>
            </div>
          ))}
        </div>
      )}

      {!compact && report.platformRules.length > 0 && (
        <div className="pt-2 border-t border-[#2a2a2a]">
          <p className="text-[11px] text-[#555] font-medium uppercase tracking-wide mb-2">Platform Rules</p>
          {report.platformRules.map((rule, i) => (
            <p key={i} className="text-[11px] text-[#a3a3a3] flex items-start gap-1.5 mb-1">
              <span className="text-[#333]">•</span>
              {rule.rule}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
