'use client';

import React from 'react';
import { GripVertical } from 'lucide-react';
import { TableItem } from '@/types';
import { TABLE_STYLES } from '@/constants/table';

interface GhostDragTableRowProps {
  item: TableItem;
  isSelected: boolean;
  onToggleSelection: (id: number, selected: boolean) => void;
  style?: React.CSSProperties;

  isDragging: boolean;
  draggedId: number | null;
  onDragStart: (
    event: React.PointerEvent,
    itemId: number,
    element: HTMLElement
  ) => void;
}

export const GhostDragTableRow: React.FC<GhostDragTableRowProps> = React.memo(
  function GhostDragTableRow({
    item,
    isSelected,
    onToggleSelection,
    style: virtualStyle,
    isDragging,
    draggedId,
    onDragStart,
  }) {
    const elementRef = React.useRef<HTMLDivElement>(null);

    const handleCheckboxChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onToggleSelection(item.id, e.target.checked);
      },
      [item.id, onToggleSelection]
    );

    const handlePointerDown = React.useCallback(
      (event: React.PointerEvent) => {
        const target = event.target as HTMLInputElement;
        if (target.type === 'checkbox') return;
        if (!elementRef.current) return;

        onDragStart(event, item.id, elementRef.current);
      },
      [item.id, onDragStart]
    );

    const isBeingDragged = draggedId === item.id;

    const rowClassName = React.useMemo(
      () =>
        [
          TABLE_STYLES.row,
          isSelected && TABLE_STYLES.rowSelected,
          isBeingDragged && 'opacity-50',
        ]
          .filter(Boolean)
          .join(' '),
      [isSelected, isBeingDragged]
    );

    return (
      <div
        ref={elementRef}
        className={rowClassName}
        data-drop-target={item.id}
        style={virtualStyle}
      >
        <div
          className={TABLE_STYLES.dragHandle}
          style={{
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={handlePointerDown}
        >
          <GripVertical size={16} />
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className={TABLE_STYLES.checkbox}
        />

        <div className={TABLE_STYLES.id}>#{item.id}</div>

        <div className={TABLE_STYLES.value}>{item.value}</div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.value === nextProps.item.value &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isDragging === nextProps.isDragging &&
      prevProps.draggedId === nextProps.draggedId &&
      prevProps.style?.top === nextProps.style?.top &&
      prevProps.style?.height === nextProps.style?.height
    );
  }
);
