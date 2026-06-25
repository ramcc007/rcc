'use client'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  description?: string
  icon?: LucideIcon
  emoji?: string
}

interface FilterToggleGroupProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  columns?: 2 | 3 | 4 | 5
}

export function FilterToggleGroup({ options, value, onChange, columns = 3 }: FilterToggleGroupProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-5',
  }

  return (
    <div className={cn('grid gap-2', gridCols[columns])}>
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm font-medium transition-all text-center',
              isSelected
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-[#1e1e1e] border-[#2a2a2a] text-[#a3a3a3] hover:border-[#3a3a3a] hover:text-white'
            )}
          >
            {Icon ? (
              <Icon className={cn('w-4 h-4', isSelected ? 'text-violet-400' : 'text-[#555]')} />
            ) : option.emoji ? (
              <span className="text-lg">{option.emoji}</span>
            ) : null}
            <span className="leading-tight">{option.label}</span>
            {option.description && (
              <span className="text-[10px] text-[#555] font-normal leading-tight hidden sm:block">
                {option.description}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
