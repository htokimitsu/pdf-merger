import { describe, it, expect } from 'vitest'
import { parsePageRange } from '../page-range-parser'

describe('parsePageRange', () => {
  it('単一ページをパースする', () => {
    const result = parsePageRange('3', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([2]) // 0-based
  })

  it('カンマ区切りの複数ページをパースする', () => {
    const result = parsePageRange('1, 3, 5', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 2, 4])
  })

  it('範囲指定をパースする', () => {
    const result = parsePageRange('1-5', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 1, 2, 3, 4])
  })

  it('範囲とページの混合をパースする', () => {
    const result = parsePageRange('1-3, 5, 8-10', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 1, 2, 4, 7, 8, 9])
  })

  it('重複ページを除去する', () => {
    const result = parsePageRange('1, 1, 2-3, 2', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 1, 2])
  })

  it('結果をソートして返す', () => {
    const result = parsePageRange('5, 1, 3', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 2, 4])
  })

  it('空文字列でエラーを返す', () => {
    const result = parsePageRange('', 10)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('範囲外のページ番号でエラーを返す', () => {
    const result = parsePageRange('11', 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('1〜10')
  })

  it('0ページ指定でエラーを返す', () => {
    const result = parsePageRange('0', 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('1〜10')
  })

  it('範囲の開始が終了より大きい場合エラーを返す', () => {
    const result = parsePageRange('5-3', 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('開始は終了以下')
  })

  it('無効な文字列でエラーを返す', () => {
    const result = parsePageRange('abc', 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('無効な形式')
  })

  it('スペースを含む入力を正しく処理する', () => {
    const result = parsePageRange(' 1 - 3 , 5 ', 10)
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 1, 2, 4])
  })
})
