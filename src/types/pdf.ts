export type SupportedFileType = 'pdf' | 'image'

export type RotationDegrees = 0 | 90 | 180 | 270

const ROTATION_STEP = 90
const ROTATION_FULL = 360

export function nextRotation(current: RotationDegrees): RotationDegrees {
  return ((current + ROTATION_STEP) % ROTATION_FULL) as RotationDegrees
}

export interface FileEntry {
  readonly id: string
  readonly file: File
  readonly name: string
  readonly size: number
  readonly pageCount: number
  readonly thumbnailUrl: string | null
  readonly fileType: SupportedFileType
  readonly rotation: RotationDegrees
}

// 後方互換エイリアス
export type PdfFileEntry = FileEntry

export interface MergeState {
  readonly status: 'idle' | 'merging' | 'done' | 'error'
  readonly progress: number
  readonly errorMessage: string | null
}

export const initialMergeState: MergeState = {
  status: 'idle',
  progress: 0,
  errorMessage: null,
}
