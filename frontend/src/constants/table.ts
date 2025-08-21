export const TABLE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  LOAD_THRESHOLD: 5,

  SEARCH_DEBOUNCE_MS: 300,

  ROW_HEIGHT: 72,
  OVERSCAN_COUNT: 10,
  OVERSCAN_COUNT_DRAGGING: 15,

  DRAG_ACTIVATION_DISTANCE: 5,
  DRAG_TOLERANCE: 5,
  DRAG_Z_INDEX: 1000,
} as const;

export const TABLE_STYLES = {
  container: 'border border-gray-200 rounded-lg overflow-hidden',
  header:
    'bg-gray-50 border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3',
  headerText:
    'text-xs sm:text-xs font-semibold text-gray-700 uppercase tracking-wider',
  row: 'flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-100 hover:bg-gray-50',
  rowSelected: 'bg-blue-50',
  rowDragging: 'opacity-50 shadow-lg z-50',
  dragHandle:
    'w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing',
  checkbox:
    'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
  id: 'w-16 sm:w-20 text-xs sm:text-sm font-mono text-gray-900',
  value: 'flex-1 text-xs sm:text-sm text-gray-900 truncate',
} as const;
