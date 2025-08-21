import { useMemo } from 'react';

interface UseSelectionOptions {
  selectedIds: number[];
  allIds: number[];
}

export const useSelection = ({ selectedIds, allIds }: UseSelectionOptions) => {
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectAllState = useMemo(() => {
    const selectedCount = selectedIds.length;
    const totalCount = allIds.length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === totalCount) return 'all';
    return 'partial';
  }, [selectedIds.length, allIds.length]);

  const isSelected = (id: number): boolean => selectedIdsSet.has(id);

  const isAllSelected = selectAllState === 'all';
  const isPartiallySelected = selectAllState === 'partial';

  return {
    selectedIdsSet,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedCount: selectedIds.length,
  };
};
