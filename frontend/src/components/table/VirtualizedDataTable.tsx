'use client';

import React from 'react';

import { SearchBar } from '../SearchBar';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingIndicator } from './LoadingIndicator';
import { EmptyState } from './EmptyState';
import { TableContainer } from './TableContainer';

import { useInfiniteTable } from '@/hooks/useInfiniteTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useVirtualization } from '@/hooks/useVirtualization';
import { useSelection } from '@/hooks/useSelection';
import { useUniqueItems } from '@/hooks/useUniqueItems';
import { useTableDragDrop } from '@/hooks/useTableDragDrop';

import { TABLE_CONSTANTS } from '@/constants/table';

export const VirtualizedDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(
    searchTerm,
    TABLE_CONSTANTS.SEARCH_DEBOUNCE_MS
  );

  const {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    selectedIds,
    toggleSelection,
    swapItems,
    loadMoreItems,
  } = useInfiniteTable({
    searchTerm: debouncedSearchTerm,
    pageSize: TABLE_CONSTANTS.DEFAULT_PAGE_SIZE,
  });

  const uniqueItems = useUniqueItems(items);

  const allIds = React.useMemo(
    () => uniqueItems.map((item) => item.id),
    [uniqueItems]
  );

  const { isSelected } = useSelection({
    selectedIds,
    allIds,
  });

  const { isDragging, ghostDragProps } = useTableDragDrop({
    searchTerm,
    onItemsSwap: swapItems,
  });

  const loadMoreCondition = React.useMemo(
    () =>
      hasMore && !isLoadingMore && !isLoading && !isDragging
        ? loadMoreItems
        : undefined,
    [hasMore, isLoadingMore, isLoading, isDragging, loadMoreItems]
  );

  const { parentRef, virtualizer, virtualItems } = useVirtualization({
    itemCount: uniqueItems.length,
    itemHeight: TABLE_CONSTANTS.ROW_HEIGHT,
    overscan: isDragging
      ? TABLE_CONSTANTS.OVERSCAN_COUNT_DRAGGING
      : TABLE_CONSTANTS.OVERSCAN_COUNT,
    onLoadMore: loadMoreCondition,
  });

  const handleToggleSelection = React.useCallback(
    (id: number, selected: boolean) => {
      toggleSelection([id], selected);
    },
    [toggleSelection]
  );

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const showEmptyState =
    !isLoading && uniqueItems.length === 0 && searchTerm.trim();
  const showTable = !isLoading && uniqueItems.length > 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="w-full">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Поиск по значению..."
          />
        </div>
      </div>

      {isLoading && <LoadingIndicator />}

      {showEmptyState && <EmptyState searchTerm={searchTerm} />}

      {showTable && (
        <TableContainer
          parentRef={parentRef}
          virtualizer={virtualizer}
          virtualItems={virtualItems}
          uniqueItems={uniqueItems}
          isSelected={isSelected}
          onToggleSelection={handleToggleSelection}
          ghostDragProps={ghostDragProps}
          isLoadingMore={isLoadingMore}
        />
      )}
    </div>
  );
};
