import { describe, it, expect, vi } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { mergePdfs, mergeFiles, getPdfPageCount } from '../pdf-merge'

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

// 1x1 RGB PNG (最小バイナリ)
const MINIMAL_PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
  0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x02, 0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00, 0x00, 0x00,
  0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
])

function createMinimalPngFile(name: string): File {
  return new File([MINIMAL_PNG_BYTES], name, { type: 'image/png' })
}

describe('mergeFiles', () => {
  it('PDFと画像を混合して結合する', async () => {
    const pdfFile = await createTestPdf(2)
    const imageFile = createMinimalPngFile('test.png')

    const result = await mergeFiles([
      { file: pdfFile, fileType: 'pdf' },
      { file: imageFile, fileType: 'image' },
    ])

    const merged = await PDFDocument.load(result)
    expect(merged.getPageCount()).toBe(3) // 2 PDF pages + 1 image page
  })

  it('画像のみを結合する', async () => {
    const img1 = createMinimalPngFile('img1.png')
    const img2 = createMinimalPngFile('img2.png')

    const result = await mergeFiles([
      { file: img1, fileType: 'image' },
      { file: img2, fileType: 'image' },
    ])

    const merged = await PDFDocument.load(result)
    expect(merged.getPageCount()).toBe(2)
  })

  it('進捗コールバックが正しく呼ばれる', async () => {
    const pdfFile = await createTestPdf(1)
    const imageFile = createMinimalPngFile('test.png')
    const onProgress = vi.fn()

    await mergeFiles(
      [
        { file: pdfFile, fileType: 'pdf' },
        { file: imageFile, fileType: 'image' },
      ],
      onProgress,
    )

    expect(onProgress).toHaveBeenCalledTimes(2)
    expect(onProgress).toHaveBeenNthCalledWith(1, 50)
    expect(onProgress).toHaveBeenNthCalledWith(2, 100)
  })
})

describe('getPdfPageCount', () => {
  it('正しいページ数を返す', async () => {
    const file = await createTestPdf(5)
    const count = await getPdfPageCount(file)
    expect(count).toBe(5)
  })
})
