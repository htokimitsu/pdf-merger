export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          PDF結合ツール
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ブラウザ上でPDFを結合できます。ファイルはサーバーに送信されません。
        </p>
      </div>
    </header>
  )
}
