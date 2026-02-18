import { useCallback, useState } from 'react'
import type { MergeState, FileEntry } from '../types/pdf'
import { initialMergeState } from '../types/pdf'
import { mergeFiles } from '../lib/pdf-merge'
import { downloadBlob } from '../lib/file-utils'

interface UsePdfMergeReturn {
  readonly mergeState: MergeState
  readonly merge: (
    files: ReadonlyArray<FileEntry>,
    outputName: string,
  ) => Promise<void>
  readonly resetState: () => void
}

export function usePdfMerge(): UsePdfMergeReturn {
  const [mergeState, setMergeState] = useState<MergeState>(initialMergeState)

  const merge = useCallback(
    async (files: ReadonlyArray<FileEntry>, outputName: string) => {
      setMergeState({ status: 'merging', progress: 0, errorMessage: null })

      try {
        const mergeableFiles = files.map((f) => ({
          file: f.file,
          fileType: f.fileType,
          rotation: f.rotation,
        }))
        const result = await mergeFiles(mergeableFiles, (progress) => {
          setMergeState((prev) => ({ ...prev, progress }))
        })

        const filename = outputName.trim() || 'merged'
        downloadBlob(result, filename)

        setMergeState({ status: 'done', progress: 100, errorMessage: null })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'ファイル結合中にエラーが発生しました'
        setMergeState({ status: 'error', progress: 0, errorMessage: message })
      }
    },
    [],
  )

  const resetState = useCallback(() => {
    setMergeState(initialMergeState)
  }, [])

  return { mergeState, merge, resetState }
}
