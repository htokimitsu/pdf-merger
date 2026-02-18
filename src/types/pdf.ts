export type SupportedFileType = 'pdf' | 'image'

export interface FileEntry {
  readonly id: string
  readonly file: File
  readonly name: string
  readonly size: number
  readonly pageCount: number
  readonly thumbnailUrl: string | null
  readonly fileType: SupportedFileType
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
