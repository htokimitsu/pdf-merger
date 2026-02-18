import type { PDFDocument, PDFPage } from 'pdf-lib'
import type { RotationDegrees } from '../types/pdf'

type EmbeddableFormat = 'jpeg' | 'png'

function getEmbeddableFormat(mimeType: string): EmbeddableFormat | null {
  if (mimeType === 'image/jpeg') return 'jpeg'
  if (mimeType === 'image/png') return 'png'
  return null
}

async function convertToPngViaCanvas(file: File): Promise<ArrayBuffer> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Canvas context の作成に失敗しました')
  }

  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  return canvasToArrayBuffer(canvas)
}

async function rotateImageViaCanvas(
  file: File,
  rotation: RotationDegrees,
): Promise<ArrayBuffer> {
  const bitmap = await createImageBitmap(file)
  const isSwapped = rotation === 90 || rotation === 270
  const canvasWidth = isSwapped ? bitmap.height : bitmap.width
  const canvasHeight = isSwapped ? bitmap.width : bitmap.height

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Canvas context の作成に失敗しました')
  }

  ctx.translate(canvasWidth / 2, canvasHeight / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)
  bitmap.close()

  return canvasToArrayBuffer(canvas)
}

function canvasToArrayBuffer(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('PNG変換に失敗しました'))
          return
        }
        resolve(blob.arrayBuffer())
      },
      'image/png',
    )
  })
}

async function getImageBytes(
  file: File,
): Promise<{ bytes: ArrayBuffer; format: EmbeddableFormat }> {
  const directFormat = getEmbeddableFormat(file.type)

  if (directFormat) {
    return { bytes: await file.arrayBuffer(), format: directFormat }
  }

  // WebP, GIF → Canvas経由でPNGに変換
  return { bytes: await convertToPngViaCanvas(file), format: 'png' }
}

export async function addImagePageToDoc(
  doc: PDFDocument,
  file: File,
  rotation: RotationDegrees = 0,
): Promise<PDFPage> {
  if (rotation !== 0) {
    // 回転がある場合は Canvas で事前に回転してから埋め込む
    const bytes = await rotateImageViaCanvas(file, rotation)
    const uint8 = new Uint8Array(bytes)
    const image = await doc.embedPng(uint8)
    const { width, height } = image.scale(1)
    const page = doc.addPage([width, height])
    page.drawImage(image, { x: 0, y: 0, width, height })
    return page
  }

  // 回転なし: 既存ロジック（パフォーマンス最適化）
  const { bytes, format } = await getImageBytes(file)
  const uint8 = new Uint8Array(bytes)

  const image =
    format === 'jpeg'
      ? await doc.embedJpg(uint8)
      : await doc.embedPng(uint8)

  const { width, height } = image.scale(1)
  const page = doc.addPage([width, height])

  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  })

  return page
}
