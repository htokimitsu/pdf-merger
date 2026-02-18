interface OutputFileNameProps {
  readonly value: string
  readonly onChange: (value: string) => void
}

export function OutputFileName({ value, onChange }: OutputFileNameProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="output-filename"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
      >
        出力ファイル名
      </label>
      <div className="flex-1 flex items-center">
        <input
          id="output-filename"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="merged"
          className="
            flex-1 px-3 py-2 text-sm rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          "
          data-testid="output-filename"
        />
        <span className="px-3 py-2 text-sm rounded-r-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          .pdf
        </span>
      </div>
    </div>
  )
}
