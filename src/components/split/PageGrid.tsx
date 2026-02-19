import type { PageEntry } from '../../types/pdf'

interface PageGridProps {
  readonly pages: ReadonlyArray<PageEntry>
  readonly onTogglePage: (pageIndex: number) => void
}

export function PageGrid({ pages, onTogglePage }: PageGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {pages.map((page) => (
        <button
          key={page.pageIndex}
          type="button"
          onClick={() => onTogglePage(page.pageIndex)}
          className={`
            relative rounded-lg border-2 overflow-hidden transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${
              page.selected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
          aria-label={`ページ ${page.pageIndex + 1}${page.selected ? '（選択中）' : ''}`}
          data-testid={`page-${page.pageIndex}`}
        >
          {/* Thumbnail */}
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {page.thumbnailUrl ? (
              <img
                src={page.thumbnailUrl}
                alt={`ページ ${page.pageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-xs">読み込み中</span>
            )}
          </div>

          {/* Page number */}
          <div className="py-1 text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
            {page.pageIndex + 1}
          </div>

          {/* Checkbox indicator */}
          <div
            className={`
              absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center
              ${
                page.selected
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }
            `}
          >
            {page.selected && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
