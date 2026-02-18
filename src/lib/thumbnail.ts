import { generateThumbnail as generatePdfThumbnail } from './pdf-thumbnail'
import type { SupportedFileType } from '../types/pdf'

const THUMBNAIL_WIDTH = 120

async function generateImageThumbnail(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = THUMBNAIL_WIDTH / bitmap.width
  const width = THUMBNAIL_WIDTH
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Canvas context の作成に失敗しました')
  }

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('サムネイル blob の作成に失敗しました'))
          return
        }
        resolve(URL.createObjectURL(blob))
      },
      'image/png',
    )
  })
}

export async function generateFileThumbnail(
  file: File,
  fileType: SupportedFileType,
): Promise<string> {
  return fileType === 'pdf'
    ? generatePdfThumbnail(file)
    : generateImageThumbnail(file)
}
