export interface TableItem {
  id: number;
  value: string;
  selected: boolean;
}

export interface SwapRequest {
  itemId1: number;
  itemId2: number;
}

export interface SelectionRequest {
  itemIds: number[];
  selected: boolean;
}
