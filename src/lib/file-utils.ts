const UNITS = ['B', 'KB', 'MB', 'GB'] as const

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  let unitIndex = 0
  let size = bytes

  while (size >= 1024 && unitIndex < UNITS.length - 1) {
    size /= 1024
    unitIndex++
  }

  const formatted = unitIndex === 0 ? size.toString() : size.toFixed(1)
  return `${formatted} ${UNITS[unitIndex]}`
}

export function downloadBlob(data: Uint8Array, filename: string): void {
  const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
