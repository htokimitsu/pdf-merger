import type { PDFDocument, PDFPage } from 'pdf-lib'

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
): Promise<PDFPage> {
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
