import { useState } from 'react'
import { SplitDropZone } from './SplitDropZone'
import { PageGrid } from './PageGrid'
import { PageSelectionControls } from './PageSelectionControls'
import { SplitButton } from './SplitButton'
import { OutputFileName } from '../OutputFileName'
import { ProgressBar } from '../ProgressBar'
import { usePdfSplit } from '../../hooks/usePdfSplit'
import { formatFileSize } from '../../lib/file-utils'

export function SplitView() {
  const {
    sourceFile,
    splitState,
    loadFile,
    togglePage,
    selectAll,
    deselectAll,
    setSelectedPages,
    split,
    resetAll,
    selectedCount,
  } = usePdfSplit()

  const [outputName, setOutputName] = useState('split')

  const handleSplit = () => {
    split(outputName)
  }

  // ファイル未選択
  if (!sourceFile && splitState.status === 'idle') {
    return <SplitDropZone onFileAdded={loadFile} />
  }

  // 読み込み中
  if (splitState.status === 'loading') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          PDFを読み込んでいます...
        </p>
        <ProgressBar progress={splitState.progress} label="読み込み中..." />
      </div>
    )
  }

  // エラー（ファイル読み込み失敗）
  if (splitState.status === 'error' && !sourceFile) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-500 dark:text-red-400" role="alert">
          {splitState.errorMessage}
        </p>
        <button
          type="button"
          onClick={resetAll}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          やり直す
        </button>
      </div>
    )
  }

  // ファイル読み込み済み
  if (!sourceFile) return null

  return (
    <div className="space-y-6">
      {/* File info */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {sourceFile.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {sourceFile.pageCount}ページ ・ {formatFileSize(sourceFile.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="px-3 py-1 text-xs font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          別のファイルを選択
        </button>
      </div>

      {/* Page selection controls */}
      <PageSelectionControls
        totalPages={sourceFile.pageCount}
        selectedCount={selectedCount}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onSetSelectedPages={setSelectedPages}
      />

      {/* Page grid */}
      <PageGrid pages={sourceFile.pages} onTogglePage={togglePage} />

      {/* Output filename */}
      <OutputFileName value={outputName} onChange={setOutputName} />

      {/* Split progress */}
      {splitState.status === 'splitting' && (
        <ProgressBar progress={splitState.progress} label="分割中..." />
      )}

      {/* Error */}
      {splitState.status === 'error' && (
        <p className="text-sm text-red-500 dark:text-red-400" role="alert">
          {splitState.errorMessage}
        </p>
      )}

      {/* Success */}
      {splitState.status === 'done' && (
        <p className="text-sm text-green-600 dark:text-green-400" role="status">
          分割が完了しました。ダウンロードが開始されます。
        </p>
      )}

      {/* Split button */}
      <SplitButton
        selectedCount={selectedCount}
        splitState={splitState}
        onSplit={handleSplit}
      />
    </div>
  )
}
