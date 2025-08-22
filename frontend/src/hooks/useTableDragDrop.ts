import React from 'react';
import { useGhostDragDrop } from './useGhostDragDrop';
import { useDragCancelOnSearch } from './useDragCancelOnSearch';

interface UseTableDragDropOptions {
  searchTerm: string;
  onItemsSwap: (draggedId: number, targetId: number) => void;
}

export const useTableDragDrop = ({
  searchTerm,
  onItemsSwap,
}: UseTableDragDropOptions) => {
  const handleGhostDragEnd = React.useCallback(
    (draggedId: number, targetId: number) => {
      if (draggedId !== targetId) {
        onItemsSwap(draggedId, targetId);
      }
    },
    [onItemsSwap]
  );

  const { isDragging, draggedId, handleDragStart, cancelDrag } =
    useGhostDragDrop({
      onDragEnd: handleGhostDragEnd,
    });

  useDragCancelOnSearch({
    searchTerm,
    isDragging,
    cancelDrag,
  });

  const ghostDragProps = React.useMemo(
    () => ({
      isDragging,
      draggedId,
      onDragStart: handleDragStart,
    }),
    [isDragging, draggedId, handleDragStart]
  );

  return {
    isDragging,
    ghostDragProps,
  };
};
