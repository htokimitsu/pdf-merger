import { describe, it, expect } from 'vitest'
import { formatFileSize } from '../file-utils'

describe('formatFileSize', () => {
  it('バイト単位で表示する', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('KB単位で表示する', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('MB単位で表示する', () => {
    expect(formatFileSize(5242880)).toBe('5.0 MB')
  })

  it('0バイトを表示する', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('1KB未満を正確に表示する', () => {
    expect(formatFileSize(1023)).toBe('1023 B')
  })

  it('ちょうど1KBを表示する', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
  })
})
