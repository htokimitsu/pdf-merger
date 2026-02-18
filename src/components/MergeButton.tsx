import type { MergeState } from '../types/pdf'

interface MergeButtonProps {
  readonly fileCount: number
  readonly mergeState: MergeState
  readonly onMerge: () => void
}

export function MergeButton({ fileCount, mergeState, onMerge }: MergeButtonProps) {
  const isDisabled = fileCount < 2 || mergeState.status === 'merging'

  return (
    <button
      type="button"
      onClick={onMerge}
      disabled={isDisabled}
      className={`
        w-full py-3 px-6 rounded-lg font-medium text-white transition-colors
        ${
          isDisabled
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
      `}
      data-testid="merge-button"
    >
      {mergeState.status === 'merging'
        ? '結合中...'
        : `PDFに結合する（${fileCount}ファイル）`}
    </button>
  )
}
