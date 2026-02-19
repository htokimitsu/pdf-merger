import { useState, useCallback } from 'react'
import { parsePageRange } from '../../lib/page-range-parser'

interface PageSelectionControlsProps {
  readonly totalPages: number
  readonly selectedCount: number
  readonly onSelectAll: () => void
  readonly onDeselectAll: () => void
  readonly onSetSelectedPages: (indices: ReadonlyArray<number>) => void
}

export function PageSelectionControls({
  totalPages,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onSetSelectedPages,
}: PageSelectionControlsProps) {
  const [rangeInput, setRangeInput] = useState('')
  const [rangeError, setRangeError] = useState<string | null>(null)

  const handleApplyRange = useCallback(() => {
    const result = parsePageRange(rangeInput, totalPages)
    if (result.valid) {
      onSetSelectedPages(result.indices)
      setRangeError(null)
    } else {
      setRangeError(result.error ?? '無効な入力です')
    }
  }, [rangeInput, totalPages, onSetSelectedPages])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleApplyRange()
      }
    },
    [handleApplyRange],
  )

  return (
    <div className="space-y-3">
      {/* Selection summary and buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selectedCount}/{totalPages} ページ選択中
        </span>
        <button
          type="button"
          onClick={onSelectAll}
          className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          すべて選択
        </button>
        <button
          type="button"
          onClick={onDeselectAll}
          className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          すべて解除
        </button>
      </div>

      {/* Range input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={rangeInput}
          onChange={(e) => {
            setRangeInput(e.target.value)
            setRangeError(null)
          }}
          onKeyDown={handleKeyDown}
          placeholder="例: 1-5, 8, 10-12"
          className="
            flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            placeholder-gray-400
          "
          data-testid="range-input"
        />
        <button
          type="button"
          onClick={handleApplyRange}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          適用
        </button>
      </div>

      {rangeError && (
        <p className="text-xs text-red-500 dark:text-red-400">{rangeError}</p>
      )}
    </div>
  )
}
