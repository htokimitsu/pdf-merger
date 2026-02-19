export interface ParseResult {
  readonly valid: boolean
  readonly indices: ReadonlyArray<number>
  readonly error?: string
}

export function parsePageRange(input: string, maxPage: number): ParseResult {
  const trimmed = input.trim()
  if (trimmed === '') {
    return { valid: false, indices: [], error: 'ページ範囲を入力してください' }
  }

  const indices = new Set<number>()
  const segments = trimmed.split(',')

  for (const segment of segments) {
    const part = segment.trim()
    if (part === '') continue

    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)

      if (start < 1 || end < 1 || start > maxPage || end > maxPage) {
        return {
          valid: false,
          indices: [],
          error: `ページ番号は1〜${maxPage}の範囲で指定してください`,
        }
      }

      if (start > end) {
        return {
          valid: false,
          indices: [],
          error: `範囲の開始は終了以下にしてください: ${part}`,
        }
      }

      for (let i = start; i <= end; i++) {
        indices.add(i - 1) // 0-based に変換
      }
      continue
    }

    const singleMatch = part.match(/^(\d+)$/)
    if (singleMatch) {
      const page = parseInt(singleMatch[1], 10)

      if (page < 1 || page > maxPage) {
        return {
          valid: false,
          indices: [],
          error: `ページ番号は1〜${maxPage}の範囲で指定してください`,
        }
      }

      indices.add(page - 1) // 0-based に変換
      continue
    }

    return {
      valid: false,
      indices: [],
      error: `無効な形式です: ${part}`,
    }
  }

  if (indices.size === 0) {
    return { valid: false, indices: [], error: 'ページ範囲を入力してください' }
  }

  const sorted = [...indices].sort((a, b) => a - b)
  return { valid: true, indices: sorted }
}
