import { useCallback, useMemo, useState } from 'react'
import type { PdfFileEntry } from '../types/pdf'
import { validatePdfFile } from '../lib/validation'
import { getPdfPageCount } from '../lib/pdf-merge'
import { generateThumbnail } from '../lib/pdf-thumbnail'

interface UsePdfFilesReturn {
  readonly files: ReadonlyArray<PdfFileEntry>
  readonly addFiles: (fileList: FileList | File[]) => Promise<void>
  readonly removeFile: (id: string) => void
  readonly reorderFiles: (activeId: string, overId: string) => void
  readonly clearFiles: () => void
  readonly totalSize: number
  readonly totalPages: number
}

export function usePdfFiles(): UsePdfFilesReturn {
  const [files, setFiles] = useState<ReadonlyArray<PdfFileEntry>>([])

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList)
    const validFiles = fileArray.filter((f) => validatePdfFile(f).valid)

    const entries = await Promise.all(
      validFiles.map(async (file): Promise<PdfFileEntry> => {
        const [pageCount, thumbnailUrl] = await Promise.all([
          getPdfPageCount(file),
          generateThumbnail(file).catch(() => null),
        ])

        return {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          pageCount,
          thumbnailUrl,
        }
      }),
    )

    setFiles((prev) => [...prev, ...entries])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.thumbnailUrl) {
        URL.revokeObjectURL(target.thumbnailUrl)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const reorderFiles = useCallback((activeId: string, overId: string) => {
    setFiles((prev) => {
      const activeIndex = prev.findIndex((f) => f.id === activeId)
      const overIndex = prev.findIndex((f) => f.id === overId)
      if (activeIndex === -1 || overIndex === -1) return prev

      const next = [...prev]
      const [moved] = next.splice(activeIndex, 1)
      next.splice(overIndex, 0, moved)
      return next
    })
  }, [])

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      for (const file of prev) {
        if (file.thumbnailUrl) {
          URL.revokeObjectURL(file.thumbnailUrl)
        }
      }
      return []
    })
  }, [])

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0),
    [files],
  )

  const totalPages = useMemo(
    () => files.reduce((sum, f) => sum + f.pageCount, 0),
    [files],
  )

  return {
    files,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    totalSize,
    totalPages,
  }
}
