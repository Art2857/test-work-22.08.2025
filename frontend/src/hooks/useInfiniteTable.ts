import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TableItem, UseInfiniteTableOptions } from '@/types';
import { TableAPI } from '@/lib/api';

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

  const toggleSelection = useCallback(
    async (itemIds: number[], selected: boolean) => {
      try {
        setItems((prev) =>
          prev.map((item) =>
            itemIds.includes(item.id) ? { ...item, selected } : item
          )
        );

        await TableAPI.updateSelection(itemIds, selected);
      } catch (err) {
        setItems((prev) =>
          prev.map((item) =>
            itemIds.includes(item.id) ? { ...item, selected: !selected } : item
          )
        );
        setError(
          err instanceof Error ? err.message : 'Failed to update selection'
        );
      }
    },
    []
  );

  const swapItems = useCallback(
    async (itemId1: number, itemId2: number) => {
      try {
        setItems((prevItems) => {
          const itemsCopy = [...prevItems];
          const index1 = itemsCopy.findIndex((item) => item.id === itemId1);
          const index2 = itemsCopy.findIndex((item) => item.id === itemId2);

          if (index1 === -1 || index2 === -1) return prevItems;

          [itemsCopy[index1], itemsCopy[index2]] = [
            itemsCopy[index2],
            itemsCopy[index1],
          ];

          return itemsCopy;
        });

        await TableAPI.swapItems(itemId1, itemId2);
      } catch (err) {
        await loadInitialItems();
        setError(err instanceof Error ? err.message : 'Failed to swap items');
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
    swapItems,
    loadMoreItems,

    refresh: loadInitialItems,
  };
};
