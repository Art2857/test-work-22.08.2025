import React from 'react';
import type { TableItem } from '@/types';

export const useUniqueItems = (items: TableItem[]) => {
  return React.useMemo(() => {
    const seen = new Set<number>();
    return items.filter((item: TableItem) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [items]);
};
