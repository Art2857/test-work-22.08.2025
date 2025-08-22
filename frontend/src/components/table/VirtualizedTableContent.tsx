'use client';

import React from 'react';
import { GhostDragTableRow } from './GhostDragTableRow';
import { LoadingIndicator } from './LoadingIndicator';
import type {
  TableItem,
  VirtualItem,
  Virtualizer,
  GhostDragProps,
} from '@/types';

interface VirtualizedTableContentProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  virtualizer: Virtualizer;
  virtualItems: VirtualItem[];
  uniqueItems: TableItem[];
  isSelected: (id: number) => boolean;
  onToggleSelection: (id: number, selected: boolean) => void;
  ghostDragProps: GhostDragProps;
  isLoadingMore: boolean;
}

const CONTAINER_STYLES = {
  height: 'calc(100vh - 16rem)',
  minHeight: '400px',
  maxHeight: '600px',
  contain: 'layout style paint' as const,
  willChange: 'scroll-position',
  WebkitOverflowScrolling: 'touch' as const,
};

const LOADING_MORE_STYLES = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  height: '60px',
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
};

export const VirtualizedTableContent: React.FC<
  VirtualizedTableContentProps
> = ({
  parentRef,
  virtualizer,
  virtualItems,
  uniqueItems,
  isSelected,
  onToggleSelection,
  ghostDragProps,
  isLoadingMore,
}) => {
  return (
    <div ref={parentRef} className="overflow-y-auto" style={CONTAINER_STYLES}>
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
              onToggleSelection={onToggleSelection}
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
              ...LOADING_MORE_STYLES,
              top: `${virtualizer.getTotalSize()}px`,
            }}
          >
            <LoadingIndicator className="py-0" />
          </div>
        )}
      </div>
    </div>
  );
};
