import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'

const PAGE_THUMBNAIL_WIDTH = 160

let workerInitialized = false

function ensureWorker(): void {
  if (workerInitialized) return
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
  workerInitialized = true
}

export async function generatePageThumbnails(
  file: File,
  onProgress?: (current: number, total: number) => void,
): Promise<ReadonlyArray<string>> {
  ensureWorker()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const totalPages = pdf.numPages
  const thumbnailUrls: string[] = []

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i)
    const unscaledViewport = page.getViewport({ scale: 1 })
    const scale = PAGE_THUMBNAIL_WIDTH / unscaledViewport.width
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas context の作成に失敗しました')
    }

    await page.render({ canvas, canvasContext: context, viewport }).promise

    const url = await new Promise<string>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('サムネイルの生成に失敗しました'))
            return
          }
          resolve(URL.createObjectURL(blob))
        },
        'image/png',
      )
    })

    thumbnailUrls.push(url)
    onProgress?.(i, totalPages)
  }

  return thumbnailUrls
}

export function revokePageThumbnails(
  urls: ReadonlyArray<string | null>,
): void {
  for (const url of urls) {
    if (url) {
      URL.revokeObjectURL(url)
    }
  }
}
