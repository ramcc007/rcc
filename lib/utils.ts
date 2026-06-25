import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | number | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(typeof date === 'number' ? date * 1000 : date))
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    queued: 'text-yellow-400 bg-yellow-400/10',
    generating: 'text-blue-400 bg-blue-400/10',
    post_processing: 'text-blue-400 bg-blue-400/10',
    review: 'text-orange-400 bg-orange-400/10',
    approved: 'text-green-400 bg-green-400/10',
    failed: 'text-red-400 bg-red-400/10',
    exported: 'text-violet-400 bg-violet-400/10',
    draft: 'text-[#a3a3a3] bg-[#a3a3a3]/10',
    active: 'text-green-400 bg-green-400/10',
    archived: 'text-[#555] bg-[#555]/10',
  }
  return colors[status] ?? 'text-[#a3a3a3] bg-[#a3a3a3]/10'
}

export function getComplianceBadgeColor(badge: string): string {
  if (badge === 'compliant') return 'text-green-400 bg-green-400/10 border-green-400/20'
  if (badge === 'needs-review') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  return 'text-red-400 bg-red-400/10 border-red-400/20'
}

export function getQualityColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}
