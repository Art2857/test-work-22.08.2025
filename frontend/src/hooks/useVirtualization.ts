import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface UseVirtualizationOptions {
  itemCount: number;
  itemHeight: number;
  overscan?: number;
  onLoadMore?: () => void;
}

export const useVirtualization = ({
  itemCount,
  itemHeight,
  overscan = 10,
  onLoadMore,
}: UseVirtualizationOptions) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
    scrollMargin: 0,
    initialOffset: 0,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!onLoadMore || virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= itemCount - 5) {
      onLoadMore();
    }
  }, [virtualItems, itemCount, onLoadMore]);

  return {
    parentRef,
    virtualizer,
    virtualItems,
  };
};
