import React from 'react';

interface UseDragCancelOnSearchOptions {
  searchTerm: string;
  isDragging: boolean;
  cancelDrag: () => void;
}

export const useDragCancelOnSearch = ({
  searchTerm,
  isDragging,
  cancelDrag,
}: UseDragCancelOnSearchOptions) => {
  const previousSearchTermRef = React.useRef<string>(searchTerm);

  React.useEffect(() => {
    if (previousSearchTermRef.current !== searchTerm) {
      if (isDragging) {
        cancelDrag();
      }
      previousSearchTermRef.current = searchTerm;
    }
  }, [searchTerm, isDragging, cancelDrag]);
};
