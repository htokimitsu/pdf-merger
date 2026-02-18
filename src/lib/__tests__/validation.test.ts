import { describe, it, expect } from 'vitest'
import { validatePdfFile, validateFile, isPdfFile, isImageFile } from '../validation'

function createMockFile(
  name: string,
  size: number,
  type: string,
): File {
  const buffer = new ArrayBuffer(size)
  return new File([buffer], name, { type })
}

describe('validateFile', () => {
  it('正常なPDFファイルを受け入れる', () => {
    const file = createMockFile('test.pdf', 1024, 'application/pdf')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('JPEG画像ファイルを受け入れる', () => {
    const file = createMockFile('photo.jpg', 1024, 'image/jpeg')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('PNG画像ファイルを受け入れる', () => {
    const file = createMockFile('image.png', 1024, 'image/png')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('WebP画像ファイルを受け入れる', () => {
    const file = createMockFile('image.webp', 1024, 'image/webp')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('GIF画像ファイルを受け入れる', () => {
    const file = createMockFile('image.gif', 1024, 'image/gif')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('非対応ファイル（テキスト）を拒否する', () => {
    const file = createMockFile('readme.txt', 1024, 'text/plain')
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('MIMEタイプなしでもPDF拡張子なら受け入れる', () => {
    const file = createMockFile('document.pdf', 1024, '')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('MIMEタイプなしでも画像拡張子なら受け入れる', () => {
    const file = createMockFile('photo.jpeg', 1024, '')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })

  it('100MB超のファイルを拒否する', () => {
    const size = 101 * 1024 * 1024
    const file = createMockFile('large.pdf', size, 'application/pdf')
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('100MB')
  })

  it('100MB超の画像ファイルを拒否する', () => {
    const size = 101 * 1024 * 1024
    const file = createMockFile('huge.jpg', size, 'image/jpeg')
    const result = validateFile(file)
    expect(result.valid).toBe(false)
  })

  it('100MB以内のファイルを受け入れる', () => {
    const size = 50 * 1024 * 1024
    const file = createMockFile('medium.pdf', size, 'application/pdf')
    const result = validateFile(file)
    expect(result).toEqual({ valid: true })
  })
})

describe('validatePdfFile（後方互換）', () => {
  it('validateFileと同じ結果を返す', () => {
    const pdf = createMockFile('test.pdf', 1024, 'application/pdf')
    expect(validatePdfFile(pdf)).toEqual(validateFile(pdf))

    const txt = createMockFile('test.txt', 1024, 'text/plain')
    expect(validatePdfFile(txt)).toEqual(validateFile(txt))
  })
})

describe('isPdfFile', () => {
  it('PDFファイルに対してtrueを返す', () => {
    const file = createMockFile('doc.pdf', 1024, 'application/pdf')
    expect(isPdfFile(file)).toBe(true)
  })

  it('画像ファイルに対してfalseを返す', () => {
    const file = createMockFile('img.png', 1024, 'image/png')
    expect(isPdfFile(file)).toBe(false)
  })
})

describe('isImageFile', () => {
  it('JPEG画像に対してtrueを返す', () => {
    const file = createMockFile('img.jpg', 1024, 'image/jpeg')
    expect(isImageFile(file)).toBe(true)
  })

  it('PNG画像に対してtrueを返す', () => {
    const file = createMockFile('img.png', 1024, 'image/png')
    expect(isImageFile(file)).toBe(true)
  })

  it('PDFに対してfalseを返す', () => {
    const file = createMockFile('doc.pdf', 1024, 'application/pdf')
    expect(isImageFile(file)).toBe(false)
  })
})
