import { useState } from 'react'
import { Header } from './components/Header'
import { DropZone } from './components/DropZone'
import { FileList } from './components/FileList'
import { OutputFileName } from './components/OutputFileName'
import { MergeButton } from './components/MergeButton'
import { ProgressBar } from './components/ProgressBar'
import { usePdfFiles } from './hooks/usePdfFiles'
import { usePdfMerge } from './hooks/usePdfMerge'
import { formatFileSize } from './lib/file-utils'

function App() {
  const {
    files,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    totalSize,
    totalPages,
  } = usePdfFiles()

  const { mergeState, merge, resetState } = usePdfMerge()
  const [outputName, setOutputName] = useState('merged')

  const handleMerge = () => {
    resetState()
    merge(files, outputName)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <DropZone onFilesAdded={addFiles} />

        <FileList
          files={files}
          onReorder={reorderFiles}
          onRemove={removeFile}
          onClear={clearFiles}
        />

        {files.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>合計: {totalPages}ページ</span>
              <span>・</span>
              <span>{formatFileSize(totalSize)}</span>
            </div>

            <OutputFileName value={outputName} onChange={setOutputName} />

            {mergeState.status === 'merging' && (
              <ProgressBar progress={mergeState.progress} />
            )}

            {mergeState.status === 'error' && (
              <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                {mergeState.errorMessage}
              </p>
            )}

            {mergeState.status === 'done' && (
              <p className="text-sm text-green-600 dark:text-green-400" role="status">
                結合が完了しました。ダウンロードが開始されます。
              </p>
            )}

            <MergeButton
              fileCount={files.length}
              mergeState={mergeState}
              onMerge={handleMerge}
            />
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
        すべての処理はブラウザ内で完結します。ファイルはサーバーに送信されません。
      </footer>
    </div>
  )
}

export default App
