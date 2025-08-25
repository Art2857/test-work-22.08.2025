import React from 'react';
import type { TableItem } from '@/types';

export const useUniqueItems = (items: TableItem[]) => {
  return React.useMemo(() => {
    if (items.length === 0) return [];

    const uniqueMap = new Map<number, TableItem>();

    for (const item of items) {
      uniqueMap.set(item.id, item);
    }

    return Array.from(uniqueMap.values());
  }, [items]);
};
