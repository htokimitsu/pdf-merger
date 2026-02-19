import type { AppTab } from '../types/pdf'

interface HeaderProps {
  readonly activeTab: AppTab
  readonly onTabChange: (tab: AppTab) => void
}

const TAB_ITEMS: ReadonlyArray<{ readonly id: AppTab; readonly label: string }> = [
  { id: 'merge', label: 'PDF結合' },
  { id: 'split', label: 'PDF分割' },
]

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          PDFツール
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          すべての処理はブラウザ内で完結します。ファイルが外部に送信されることはありません。
        </p>
        <nav className="mt-4 flex gap-1" role="tablist">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
