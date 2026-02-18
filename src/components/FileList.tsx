import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { PdfFileEntry } from '../types/pdf'
import { FileItem } from './FileItem'

interface FileListProps {
  readonly files: ReadonlyArray<PdfFileEntry>
  readonly onReorder: (activeId: string, overId: string) => void
  readonly onRemove: (id: string) => void
  readonly onRotate: (id: string) => void
  readonly onClear: () => void
}

export function FileList({ files, onReorder, onRemove, onRotate, onClear }: FileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id))
    }
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          ファイル一覧（{files.length}件）
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
        >
          すべてクリア
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2" data-testid="file-list">
            {files.map((entry, index) => (
              <FileItem
                key={entry.id}
                entry={entry}
                index={index}
                onRemove={onRemove}
                onRotate={onRotate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
