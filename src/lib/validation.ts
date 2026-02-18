const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

const SUPPORTED_PDF_MIME = 'application/pdf'

const SUPPORTED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

const SUPPORTED_PDF_EXTENSIONS = ['.pdf'] as const

const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
] as const

interface ValidationResult {
  readonly valid: boolean
  readonly error?: string
}

export function isPdfFile(file: File): boolean {
  const mimeMatch = file.type === SUPPORTED_PDF_MIME
  const extMatch = SUPPORTED_PDF_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  )
  return mimeMatch || extMatch
}

export function isImageFile(file: File): boolean {
  const mimeMatch = (SUPPORTED_IMAGE_MIMES as ReadonlyArray<string>).includes(
    file.type,
  )
  const extMatch = SUPPORTED_IMAGE_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  )
  return mimeMatch || extMatch
}

export function validateFile(file: File): ValidationResult {
  if (!isPdfFile(file) && !isImageFile(file)) {
    return {
      valid: false,
      error: 'PDFまたは画像ファイル（JPEG、PNG、WebP、GIF）のみアップロードできます',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'ファイルサイズは100MB以下にしてください' }
  }

  return { valid: true }
}

// 後方互換エイリアス
export const validatePdfFile = validateFile

export const ACCEPTED_FILE_TYPES = [
  '.pdf',
  'application/pdf',
  '.jpg',
  '.jpeg',
  'image/jpeg',
  '.png',
  'image/png',
  '.webp',
  'image/webp',
  '.gif',
  'image/gif',
].join(',')
