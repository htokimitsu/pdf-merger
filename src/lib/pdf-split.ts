import { PDFDocument } from 'pdf-lib'

type ProgressCallback = (percent: number) => void

export async function splitPdf(
  sourceArrayBuffer: ArrayBuffer,
  pageIndices: ReadonlyArray<number>,
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('抽出するページが選択されていません')
  }

  const sourceDoc = await PDFDocument.load(sourceArrayBuffer)
  const totalPages = sourceDoc.getPageCount()

  for (const index of pageIndices) {
    if (index < 0 || index >= totalPages) {
      throw new Error(`ページ番号が範囲外です: ${index + 1}`)
    }
  }

  const newDoc = await PDFDocument.create()
  const copiedPages = await newDoc.copyPages(sourceDoc, [...pageIndices])

  for (let i = 0; i < copiedPages.length; i++) {
    newDoc.addPage(copiedPages[i])
    onProgress?.(Math.round(((i + 1) / copiedPages.length) * 100))
  }

  return newDoc.save()
}
