export function moveItem<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= array.length ||
    toIndex >= array.length
  ) {
    return array;
  }

  const result = [...array];
  const [movedItem] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, movedItem);

  return result;
}

export function moveItemById<T extends { id: number }>(
  array: T[],
  itemId: number,
  targetId: number
): T[] {
  const fromIndex = array.findIndex((item) => item.id === itemId);
  const toIndex = array.findIndex((item) => item.id === targetId);

  if (fromIndex === -1 || toIndex === -1) {
    return array;
  }

  return moveItem(array, fromIndex, toIndex);
}
