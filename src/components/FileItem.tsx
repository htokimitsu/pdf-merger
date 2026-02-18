import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PdfFileEntry } from '../types/pdf'
import { formatFileSize } from '../lib/file-utils'

interface FileItemProps {
  readonly entry: PdfFileEntry
  readonly index: number
  readonly onRemove: (id: string) => void
}

export function FileItem({ entry, index, onRemove }: FileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border
        border-gray-200 dark:border-gray-700 group
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
      `}
      data-testid="file-item"
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
        {...attributes}
        {...listeners}
        aria-label="ドラッグして並び替え"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
        </svg>
      </button>

      {/* Order number */}
      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div className="flex-shrink-0 w-10 h-14 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
        {entry.thumbnailUrl ? (
          <img
            src={entry.thumbnailUrl}
            alt={`${entry.name} の1ページ目`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            PDF
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {entry.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {entry.pageCount}ページ ・ {formatFileSize(entry.size)}
        </p>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(entry.id)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        aria-label={`${entry.name} を削除`}
        data-testid="remove-button"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
