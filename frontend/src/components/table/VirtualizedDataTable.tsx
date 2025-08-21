'use client';

import React from 'react';

import { SearchBar } from '../SearchBar';
import { TableHeader } from './TableHeader';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingIndicator } from './LoadingIndicator';
import { GhostDragTableRow } from './GhostDragTableRow';

import { useInfiniteTable } from '@/hooks/useInfiniteTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useGhostDragDrop } from '@/hooks/useGhostDragDrop';
import { useVirtualization } from '@/hooks/useVirtualization';
import { useSelection } from '@/hooks/useSelection';

import { TABLE_CONSTANTS } from '@/constants/table';
import type { TableItem } from '@/types';

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

  const uniqueItems = React.useMemo(() => {
    const seen = new Set<number>();
    return items.filter((item: TableItem) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [items]);

  const allIds = React.useMemo(
    () => uniqueItems.map((item) => item.id),
    [uniqueItems]
  );

  const { isSelected } = useSelection({
    selectedIds,
    allIds,
  });

  const handleGhostDragEnd = React.useCallback(
    (draggedId: number, targetId: number) => {
      if (draggedId !== targetId) {
        swapItems(draggedId, targetId);
      }
    },
    [swapItems]
  );

  const { isDragging, draggedId, handleDragStart } = useGhostDragDrop({
    onDragEnd: handleGhostDragEnd,
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

  const ghostDragProps = React.useMemo(
    () => ({
      isDragging,
      draggedId,
      onDragStart: handleDragStart,
    }),
    [isDragging, draggedId, handleDragStart]
  );

  if (error) {
    return <ErrorDisplay error={error} />;
  }

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

      {!isLoading && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TableHeader />

          <div
            ref={parentRef}
            className="overflow-y-auto"
            style={{
              height: 'calc(100vh - 16rem)',
              minHeight: '400px',
              maxHeight: '600px',
              contain: 'layout style paint',
              willChange: 'scroll-position',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualItems.map((virtualItem) => {
                const item = uniqueItems[virtualItem.index];
                return (
                  <GhostDragTableRow
                    key={item.id}
                    item={item}
                    isSelected={isSelected(item.id)}
                    onToggleSelection={handleToggleSelection}
                    style={{
                      position: 'absolute',
                      top: `${virtualItem.start}px`,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                    }}
                    {...ghostDragProps}
                  />
                );
              })}

              {isLoadingMore && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${virtualizer.getTotalSize()}px`,
                    left: 0,
                    right: 0,
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <LoadingIndicator className="py-0" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
