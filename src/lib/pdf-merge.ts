import { PDFDocument } from 'pdf-lib'

type ProgressCallback = (percent: number) => void

export async function mergePdfs(
  files: ReadonlyArray<File>,
  onProgress?: ProgressCallback,
): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create()
  const totalFiles = files.length

  for (let i = 0; i < totalFiles; i++) {
    const arrayBuffer = await files[i].arrayBuffer()
    const sourceDoc = await PDFDocument.load(arrayBuffer)
    const pages = await mergedDoc.copyPages(sourceDoc, sourceDoc.getPageIndices())

    for (const page of pages) {
      mergedDoc.addPage(page)
    }

    onProgress?.(Math.round(((i + 1) / totalFiles) * 100))
  }

  return mergedDoc.save()
}

export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer()
  const doc = await PDFDocument.load(arrayBuffer)
  return doc.getPageCount()
}
