import { useCallback, useState, useRef } from 'react';

interface UseGhostDragDropOptions {
  onDragEnd: (draggedId: number, targetId: number) => void;
}

export const useGhostDragDrop = ({ onDragEnd }: UseGhostDragDropOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const ghostElementRef = useRef<HTMLElement | null>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  const currentListenersRef = useRef<{
    handleMove?: (e: PointerEvent) => void;
    handleEnd?: (e: PointerEvent) => void;
  }>({});

  const cancelDrag = useCallback(() => {
    if (!isDragging) return;

    if (
      currentListenersRef.current.handleMove &&
      currentListenersRef.current.handleEnd
    ) {
      document.removeEventListener(
        'pointermove',
        currentListenersRef.current.handleMove
      );
      document.removeEventListener(
        'pointerup',
        currentListenersRef.current.handleEnd
      );
    }

    if (ghostElementRef.current) {
      try {
        document.body.removeChild(ghostElementRef.current);
      } catch {
        // ignore
      }
      ghostElementRef.current = null;
    }

    setIsDragging(false);
    setDraggedId(null);
    currentListenersRef.current = {};
  }, [isDragging]);

  const handleDragStart = useCallback(
    (event: React.PointerEvent, itemId: number, element: HTMLElement) => {
      event.preventDefault();

      setIsDragging(true);
      setDraggedId(itemId);

      const rect = element.getBoundingClientRect();
      dragStartOffset.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      const ghost = element.cloneNode(true) as HTMLElement;

      ghost.style.position = 'fixed';
      ghost.style.pointerEvents = 'none';
      ghost.style.zIndex = '9999';
      ghost.style.opacity = '0.8';
      ghost.style.width = `${element.offsetWidth}px`;
      ghost.style.height = `${element.offsetHeight}px`;
      ghost.style.left = `${event.clientX - dragStartOffset.current.x}px`;
      ghost.style.top = `${event.clientY - dragStartOffset.current.y}px`;
      ghost.style.transform = 'rotate(2deg)';
      ghost.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';

      const inputs = ghost.querySelectorAll('input, button');
      inputs.forEach((input) => input.setAttribute('disabled', 'true'));

      document.body.appendChild(ghost);
      ghostElementRef.current = ghost;

      const handleMove = (e: PointerEvent) => {
        if (!ghostElementRef.current) return;

        const x = e.clientX - dragStartOffset.current.x;
        const y = e.clientY - dragStartOffset.current.y;

        ghostElementRef.current.style.left = `${x}px`;
        ghostElementRef.current.style.top = `${y}px`;
      };

      const handleEnd = (e: PointerEvent) => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleEnd);

        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        let targetId: number | null = null;

        let current = elementBelow;
        while (current && current !== document.body) {
          const id = current.getAttribute?.('data-drop-target');
          if (id) {
            targetId = Number(id);
            break;
          }
          current = current.parentElement;
        }

        if (ghostElementRef.current) {
          try {
            document.body.removeChild(ghostElementRef.current);
          } catch {
            // Ignore removal errors
          }
          ghostElementRef.current = null;
        }

        if (targetId && targetId !== itemId) {
          onDragEnd(itemId, targetId);
        }

        setIsDragging(false);
        setDraggedId(null);
        currentListenersRef.current = {};
      };

      currentListenersRef.current = { handleMove, handleEnd };
      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleEnd);
    },
    [onDragEnd]
  );

  return {
    isDragging,
    draggedId,
    handleDragStart,
    cancelDrag,
  };
};
