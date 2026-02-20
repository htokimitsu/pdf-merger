import { describe, it, expect, vi } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { splitPdf } from '../pdf-split'

async function createTestPdfBuffer(pageCount: number): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pageCount; i++) {
    doc.addPage()
  }
  const bytes = await doc.save()
  return bytes.buffer as ArrayBuffer
}

describe('splitPdf', () => {
  it('指定したページのみ抽出する', async () => {
    const buffer = await createTestPdfBuffer(5)

    const result = await splitPdf(buffer, [0, 2, 4])
    const doc = await PDFDocument.load(result)

    expect(doc.getPageCount()).toBe(3)
  })

  it('単一ページを抽出する', async () => {
    const buffer = await createTestPdfBuffer(3)

    const result = await splitPdf(buffer, [1])
    const doc = await PDFDocument.load(result)

    expect(doc.getPageCount()).toBe(1)
  })

  it('全ページを抽出する', async () => {
    const buffer = await createTestPdfBuffer(4)

    const result = await splitPdf(buffer, [0, 1, 2, 3])
    const doc = await PDFDocument.load(result)

    expect(doc.getPageCount()).toBe(4)
  })

  it('空のpageIndicesでエラーをスローする', async () => {
    const buffer = await createTestPdfBuffer(3)

    await expect(splitPdf(buffer, [])).rejects.toThrow(
      '抽出するページが選択されていません',
    )
  })

  it('範囲外のページインデックスでエラーをスローする', async () => {
    const buffer = await createTestPdfBuffer(3)

    await expect(splitPdf(buffer, [0, 5])).rejects.toThrow(
      'ページ番号が範囲外です',
    )
  })

  it('進捗コールバックが呼ばれる', async () => {
    const buffer = await createTestPdfBuffer(4)
    const onProgress = vi.fn()

    await splitPdf(buffer, [0, 1, 2], undefined, onProgress)

    expect(onProgress).toHaveBeenCalledTimes(3)
    expect(onProgress).toHaveBeenNthCalledWith(1, 33)
    expect(onProgress).toHaveBeenNthCalledWith(2, 67)
    expect(onProgress).toHaveBeenNthCalledWith(3, 100)
  })

  it('回転を適用してページを抽出する', async () => {
    const buffer = await createTestPdfBuffer(3)

    const result = await splitPdf(buffer, [0, 1], [90, 180])
    const doc = await PDFDocument.load(result)

    expect(doc.getPageCount()).toBe(2)
    expect(doc.getPage(0).getRotation().angle).toBe(90)
    expect(doc.getPage(1).getRotation().angle).toBe(180)
  })

  it('rotationsが未指定の場合は回転を適用しない', async () => {
    const buffer = await createTestPdfBuffer(2)

    const result = await splitPdf(buffer, [0, 1])
    const doc = await PDFDocument.load(result)

    expect(doc.getPage(0).getRotation().angle).toBe(0)
    expect(doc.getPage(1).getRotation().angle).toBe(0)
  })
})
