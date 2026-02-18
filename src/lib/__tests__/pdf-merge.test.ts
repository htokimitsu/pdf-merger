import { describe, it, expect, vi } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { mergePdfs, getPdfPageCount } from '../pdf-merge'

async function createTestPdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) {
    doc.addPage()
  }
  const bytes = await doc.save()
  return new File([bytes.buffer as ArrayBuffer], `test-${pageCount}pages.pdf`, {
    type: 'application/pdf',
  })
}

describe('mergePdfs', () => {
  it('2つのPDFを結合する', async () => {
    const file1 = await createTestPdf(2)
    const file2 = await createTestPdf(3)

    const result = await mergePdfs([file1, file2])
    const merged = await PDFDocument.load(result)

    expect(merged.getPageCount()).toBe(5)
  })

  it('3つ以上のPDFを結合する', async () => {
    const files = await Promise.all([
      createTestPdf(1),
      createTestPdf(2),
      createTestPdf(3),
    ])

    const result = await mergePdfs(files)
    const merged = await PDFDocument.load(result)

    expect(merged.getPageCount()).toBe(6)
  })

  it('進捗コールバックが呼ばれる', async () => {
    const file1 = await createTestPdf(1)
    const file2 = await createTestPdf(1)
    const onProgress = vi.fn()

    await mergePdfs([file1, file2], onProgress)

    expect(onProgress).toHaveBeenCalledTimes(2)
    expect(onProgress).toHaveBeenNthCalledWith(1, 50)
    expect(onProgress).toHaveBeenNthCalledWith(2, 100)
  })

  it('破損PDFの結合でエラーをスローする', async () => {
    const corruptFile = new File([new Uint8Array([1, 2, 3])], 'corrupt.pdf', {
      type: 'application/pdf',
    })
    const validFile = await createTestPdf(1)

    await expect(mergePdfs([corruptFile, validFile])).rejects.toThrow()
  })
})

describe('getPdfPageCount', () => {
  it('正しいページ数を返す', async () => {
    const file = await createTestPdf(5)
    const count = await getPdfPageCount(file)
    expect(count).toBe(5)
  })
})
