import { PDFDocument, degrees } from 'pdf-lib'
import type { RotationDegrees } from '../types/pdf'

type ProgressCallback = (percent: number) => void

export async function splitPdf(
  sourceArrayBuffer: ArrayBuffer,
  pageIndices: ReadonlyArray<number>,
  rotations?: ReadonlyArray<RotationDegrees>,
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
    const page = copiedPages[i]
    const rotation = rotations?.[i] ?? 0
    if (rotation !== 0) {
      const currentAngle = page.getRotation().angle
      page.setRotation(degrees(currentAngle + rotation))
    }
    newDoc.addPage(page)
    onProgress?.(Math.round(((i + 1) / copiedPages.length) * 100))
  }

  return newDoc.save()
}
