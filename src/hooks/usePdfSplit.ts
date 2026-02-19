import { useCallback, useMemo, useState } from 'react'
import type { SplitSourceFile, SplitState, PageEntry } from '../types/pdf'
import { initialSplitState } from '../types/pdf'
import { splitPdf } from '../lib/pdf-split'
import { generatePageThumbnails, revokePageThumbnails } from '../lib/pdf-page-thumbnails'
import { getPdfPageCount } from '../lib/pdf-merge'
import { downloadBlob } from '../lib/file-utils'

interface UsePdfSplitReturn {
  readonly sourceFile: SplitSourceFile | null
  readonly splitState: SplitState
  readonly loadFile: (file: File) => Promise<void>
  readonly togglePage: (pageIndex: number) => void
  readonly selectAll: () => void
  readonly deselectAll: () => void
  readonly setSelectedPages: (indices: ReadonlyArray<number>) => void
  readonly split: (outputName: string) => Promise<void>
  readonly resetAll: () => void
  readonly selectedCount: number
}

export function usePdfSplit(): UsePdfSplitReturn {
  const [sourceFile, setSourceFile] = useState<SplitSourceFile | null>(null)
  const [splitState, setSplitState] = useState<SplitState>(initialSplitState)

  const loadFile = useCallback(async (file: File) => {
    // 既存のサムネイルを解放
    setSourceFile((prev) => {
      if (prev) {
        revokePageThumbnails(prev.pages.map((p) => p.thumbnailUrl))
      }
      return null
    })

    setSplitState({ status: 'loading', progress: 0, errorMessage: null })

    try {
      const pageCount = await getPdfPageCount(file)
      const thumbnailUrls = await generatePageThumbnails(file, (current, total) => {
        setSplitState((prev) => ({
          ...prev,
          progress: Math.round((current / total) * 100),
        }))
      })

      const pages: ReadonlyArray<PageEntry> = thumbnailUrls.map((url, i) => ({
        pageIndex: i,
        thumbnailUrl: url,
        selected: true,
      }))

      setSourceFile({
        file,
        name: file.name,
        size: file.size,
        pageCount,
        pages,
      })

      setSplitState({ status: 'ready', progress: 0, errorMessage: null })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'PDFの読み込み中にエラーが発生しました'
      setSplitState({ status: 'error', progress: 0, errorMessage: message })
    }
  }, [])

  const togglePage = useCallback((pageIndex: number) => {
    setSourceFile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        pages: prev.pages.map((p) =>
          p.pageIndex === pageIndex ? { ...p, selected: !p.selected } : p,
        ),
      }
    })
  }, [])

  const selectAll = useCallback(() => {
    setSourceFile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        pages: prev.pages.map((p) => ({ ...p, selected: true })),
      }
    })
  }, [])

  const deselectAll = useCallback(() => {
    setSourceFile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        pages: prev.pages.map((p) => ({ ...p, selected: false })),
      }
    })
  }, [])

  const setSelectedPages = useCallback((indices: ReadonlyArray<number>) => {
    const indexSet = new Set(indices)
    setSourceFile((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          selected: indexSet.has(p.pageIndex),
        })),
      }
    })
  }, [])

  const split = useCallback(
    async (outputName: string) => {
      if (!sourceFile) return

      const selectedIndices = sourceFile.pages
        .filter((p) => p.selected)
        .map((p) => p.pageIndex)

      if (selectedIndices.length === 0) return

      setSplitState({ status: 'splitting', progress: 0, errorMessage: null })

      try {
        const arrayBuffer = await sourceFile.file.arrayBuffer()
        const result = await splitPdf(arrayBuffer, selectedIndices, (progress) => {
          setSplitState((prev) => ({ ...prev, progress }))
        })

        const filename = outputName.trim() || 'split'
        downloadBlob(result, filename)

        setSplitState({ status: 'done', progress: 100, errorMessage: null })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'PDF分割中にエラーが発生しました'
        setSplitState({ status: 'error', progress: 0, errorMessage: message })
      }
    },
    [sourceFile],
  )

  const resetAll = useCallback(() => {
    setSourceFile((prev) => {
      if (prev) {
        revokePageThumbnails(prev.pages.map((p) => p.thumbnailUrl))
      }
      return null
    })
    setSplitState(initialSplitState)
  }, [])

  const selectedCount = useMemo(
    () => (sourceFile ? sourceFile.pages.filter((p) => p.selected).length : 0),
    [sourceFile],
  )

  return {
    sourceFile,
    splitState,
    loadFile,
    togglePage,
    selectAll,
    deselectAll,
    setSelectedPages,
    split,
    resetAll,
    selectedCount,
  }
}
