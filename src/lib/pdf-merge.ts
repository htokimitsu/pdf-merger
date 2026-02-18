import { PDFDocument } from 'pdf-lib'
import type { SupportedFileType } from '../types/pdf'
import { addImagePageToDoc } from './image-to-pdf'

type ProgressCallback = (percent: number) => void

export interface MergeableFile {
  readonly file: File
  readonly fileType: SupportedFileType
}

export async function mergeFiles(
  entries: ReadonlyArray<MergeableFile>,
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create()
  const totalEntries = entries.length

  for (let i = 0; i < totalEntries; i++) {
    const entry = entries[i]

    if (entry.fileType === 'pdf') {
      const arrayBuffer = await entry.file.arrayBuffer()
      const sourceDoc = await PDFDocument.load(arrayBuffer)
      const pages = await mergedDoc.copyPages(
        sourceDoc,
        sourceDoc.getPageIndices(),
      )
      for (const page of pages) {
        mergedDoc.addPage(page)
      }
    } else {
      await addImagePageToDoc(mergedDoc, entry.file)
    }

    onProgress?.(Math.round(((i + 1) / totalEntries) * 100))
  }

  return mergedDoc.save()
}

// 後方互換: 既存テスト用
export async function mergePdfs(
  files: ReadonlyArray<File>,
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  const entries: ReadonlyArray<MergeableFile> = files.map((file) => ({
    file,
    fileType: 'pdf' as const,
  }))
  return mergeFiles(entries, onProgress)
}

export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer()
  const doc = await PDFDocument.load(arrayBuffer)
  return doc.getPageCount()
}
