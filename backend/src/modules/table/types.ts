export interface TableItem {
  id: number;
  value: string;
  selected: boolean;
}

export interface InsertRequest {
  itemId: number;
  targetId: number;
}

export interface SelectionRequest {
  itemIds: number[];
  selected: boolean;
}
