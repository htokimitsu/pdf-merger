import { useState } from 'react'
import type { AppTab } from './types/pdf'
import { Header } from './components/Header'
import { MergeView } from './components/merge/MergeView'
import { SplitView } from './components/split/SplitView'

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('merge')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'merge' && <MergeView />}
        {activeTab === 'split' && <SplitView />}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
        &copy; PDFツール
      </footer>
    </div>
  )
}

export default App
