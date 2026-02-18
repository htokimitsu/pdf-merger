import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'

const THUMBNAIL_WIDTH = 120

let workerInitialized = false

function ensureWorker(): void {
  if (workerInitialized) return
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
  workerInitialized = true
}

export async function generateThumbnail(file: File): Promise<string> {
  ensureWorker()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)

  const unscaledViewport = page.getViewport({ scale: 1 })
  const scale = THUMBNAIL_WIDTH / unscaledViewport.width
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas context could not be created')
  }

  await page.render({ canvas, canvasContext: context, viewport }).promise

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create thumbnail blob'))
          return
        }
        resolve(URL.createObjectURL(blob))
      },
      'image/png',
    )
  })
}
