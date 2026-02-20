import type { PageEntry } from '../../types/pdf'

interface PageGridProps {
  readonly pages: ReadonlyArray<PageEntry>
  readonly onTogglePage: (pageIndex: number) => void
  readonly onRotatePage: (pageIndex: number) => void
  readonly onDownloadPage: (pageIndex: number) => void
}

export function PageGrid({ pages, onTogglePage, onRotatePage, onDownloadPage }: PageGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {pages.map((page) => (
        <div
          key={page.pageIndex}
          className={`
            relative rounded-lg border-2 overflow-hidden transition-all duration-200
            ${
              page.selected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
          data-testid={`page-${page.pageIndex}`}
        >
          {/* Clickable thumbnail area */}
          <button
            type="button"
            onClick={() => onTogglePage(page.pageIndex)}
            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-label={`ページ ${page.pageIndex + 1}${page.selected ? '（選択中）' : ''}`}
          >
            {/* Thumbnail */}
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {page.thumbnailUrl ? (
                <img
                  src={page.thumbnailUrl}
                  alt={`ページ ${page.pageIndex + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                />
              ) : (
                <span className="text-gray-400 text-xs">読み込み中</span>
              )}
            </div>
          </button>

          {/* Page info and actions */}
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {page.pageIndex + 1}
              {page.rotation !== 0 && (
                <span className="ml-1 text-blue-500 dark:text-blue-400">
                  {page.rotation}°
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {/* Rotate button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRotatePage(page.pageIndex)
                }}
                className="p-0.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                aria-label={`ページ ${page.pageIndex + 1} を90°回転`}
                data-testid={`rotate-page-${page.pageIndex}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* Download button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownloadPage(page.pageIndex)
                }}
                className="p-0.5 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                aria-label={`ページ ${page.pageIndex + 1} をダウンロード`}
                data-testid={`download-page-${page.pageIndex}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
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
        </div>
      ))}
    </div>
  )
}
