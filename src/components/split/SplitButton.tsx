import type { SplitState } from '../../types/pdf'

interface SplitButtonProps {
  readonly selectedCount: number
  readonly splitState: SplitState
  readonly onSplit: () => void
}

export function SplitButton({ selectedCount, splitState, onSplit }: SplitButtonProps) {
  const isDisabled = selectedCount === 0 || splitState.status === 'splitting'

  return (
    <button
      type="button"
      onClick={onSplit}
      disabled={isDisabled}
      className={`
        w-full py-3 px-6 rounded-lg font-medium text-white transition-colors
        ${
          isDisabled
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
      `}
      data-testid="split-button"
    >
      {splitState.status === 'splitting'
        ? '分割中...'
        : `選択したページを抽出する（${selectedCount}ページ）`}
    </button>
  )
}
