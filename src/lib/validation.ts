const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

interface ValidationResult {
  readonly valid: boolean
  readonly error?: string
}

export function validatePdfFile(file: File): ValidationResult {
  const isPdfMime = file.type === 'application/pdf'
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf')

  if (!isPdfMime && !isPdfExtension) {
    return { valid: false, error: 'PDFファイルのみアップロードできます' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'ファイルサイズは100MB以下にしてください' }
  }

  return { valid: true }
}
