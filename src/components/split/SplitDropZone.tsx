import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react'

const ACCEPT_PDF = '.pdf,application/pdf'

interface SplitDropZoneProps {
  readonly onFileAdded: (file: File) => void
}

export function SplitDropZone({ onFileAdded }: SplitDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/pdf') {
        onFileAdded(file)
      }
    },
    [onFileAdded],
  )

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileAdded(file)
        e.target.value = ''
      }
    },
    [onFileAdded],
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
      className={`
        border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
      `}
      data-testid="split-dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_PDF}
        className="hidden"
        onChange={handleFileChange}
        data-testid="split-file-input"
      />
      <div className="text-gray-500 dark:text-gray-400">
        <svg
          className="mx-auto h-16 w-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <p className="text-base font-medium">
          PDFファイルをドラッグ&ドロップ
        </p>
        <p className="mt-2 text-sm">
          またはクリックしてPDFファイルを選択
        </p>
      </div>
    </div>
  )
}
