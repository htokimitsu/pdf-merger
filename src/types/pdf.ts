export interface PdfFileEntry {
  readonly id: string
  readonly file: File
  readonly name: string
  readonly size: number
  readonly pageCount: number
  readonly thumbnailUrl: string | null
}

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
