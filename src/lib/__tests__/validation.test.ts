import { describe, it, expect } from 'vitest'
import { validatePdfFile } from '../validation'

function createMockFile(
  name: string,
  size: number,
  type: string,
): File {
  const buffer = new ArrayBuffer(size)
  return new File([buffer], name, { type })
}

describe('validatePdfFile', () => {
  it('正常なPDFファイルを受け入れる', () => {
    const file = createMockFile('test.pdf', 1024, 'application/pdf')
    const result = validatePdfFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('非PDFファイル（画像）を拒否する', () => {
    const file = createMockFile('image.png', 1024, 'image/png')
    const result = validatePdfFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('MIMEタイプなしでも拡張子がpdfなら受け入れる', () => {
    const file = createMockFile('document.pdf', 1024, '')
    const result = validatePdfFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('100MB超のファイルを拒否する', () => {
    const size = 101 * 1024 * 1024
    const file = createMockFile('large.pdf', size, 'application/pdf')
    const result = validatePdfFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('100MB')
  })

  it('100MB以内のファイルを受け入れる', () => {
    const size = 50 * 1024 * 1024
    const file = createMockFile('medium.pdf', size, 'application/pdf')
    const result = validatePdfFile(file)
    expect(result).toEqual({ valid: true })
  })
})
