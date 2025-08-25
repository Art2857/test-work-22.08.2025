import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TableItem, UseInfiniteTableOptions } from '@/types';
import { TableAPI } from '@/lib/api';
import { moveItemById } from '@/utils/array-utils';

export const useInfiniteTable = (options: UseInfiniteTableOptions) => {
  const [items, setItems] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = options.pageSize || 20;

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setItems([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
  }, [options.searchTerm]);

  const loadInitialItems = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response = await TableAPI.getItems(1, pageSize, options.searchTerm);

      setItems(response.data || []);
      setTotal(response.total);
      setCurrentPage(1);
      setHasMore(
        (response.data?.length || 0) >= pageSize && response.total > pageSize
      );
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [options.searchTerm, pageSize]);

  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await TableAPI.getItems(
        nextPage,
        pageSize,
        options.searchTerm
      );

      const newItems = response.data || [];

      setItems((prev) => {
        if (newItems.length === 0) return prev;

        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item.id)
        );

        return uniqueNewItems.length > 0 ? [...prev, ...uniqueNewItems] : prev;
      });

      setCurrentPage(nextPage);
      setHasMore(
        newItems.length >= pageSize && nextPage * pageSize < response.total
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load more items'
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    currentPage,
    pageSize,
    options.searchTerm,
    isLoadingMore,
    hasMore,
    isLoading,
  ]);

  useEffect(() => {
    loadInitialItems();
  }, [loadInitialItems]);

  const updateSelection = useCallback(
    async (itemIds: number[], selected: boolean) => {
      try {
        await TableAPI.updateSelection(itemIds, selected);

        setItems((prev) => {
          const idsSet = new Set(itemIds);
          return prev.map((item) =>
            idsSet.has(item.id) ? { ...item, selected } : item
          );
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update selection'
        );
      }
    },
    []
  );

  const toggleSelection = useCallback(
    (itemId: number, selected: boolean) => updateSelection([itemId], selected),
    [updateSelection]
  );

  const toggleMultipleSelection = useCallback(
    (itemIds: number[], selected: boolean) =>
      updateSelection(itemIds, selected),
    [updateSelection]
  );

  const insertItem = useCallback(
    async (itemId: number, targetId: number) => {
      try {
        setItems((prevItems) => moveItemById(prevItems, itemId, targetId));

        await TableAPI.insertItem(itemId, targetId);
      } catch (err) {
        await loadInitialItems();
        setError(err instanceof Error ? err.message : 'Failed to move item');
      }
    },
    [loadInitialItems]
  );

  const selectedIds = useMemo(
    () =>
      Array.isArray(items)
        ? items.filter((item) => item.selected).map((item) => item.id)
        : [],
    [items]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    items,
    isLoading,
    isLoadingMore,
    error,
    total,
    hasMore,
    selectedIds,
    toggleSelection,
    toggleMultipleSelection,
    insertItem,
    loadMoreItems,

    refresh: loadInitialItems,
  };
};
