import { TableItem, PaginationResponse, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class TableAPI {
  static async getItems(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<PaginationResponse<TableItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_URL}/table/items?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }

    const apiResponse: ApiResponse<PaginationResponse<TableItem>> =
      await response.json();
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Failed to fetch items');
    }

    return apiResponse.data;
  }

  static async updateSelection(
    itemIds: number[],
    selected: boolean
  ): Promise<void> {
    const response = await fetch(`${API_URL}/table/selection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemIds, selected }),
    });

    if (!response.ok) {
      throw new Error('Failed to update selection');
    }

    const apiResponse: ApiResponse<{ message: string }> = await response.json();
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Failed to update selection');
    }
  }

  static async insertItem(itemId: number, targetId: number): Promise<void> {
    const response = await fetch(`${API_URL}/table/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId, targetId }),
    });

    if (!response.ok) {
      throw new Error('Failed to move item');
    }

    const apiResponse: ApiResponse<{ message: string }> = await response.json();
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'Failed to move item');
    }
  }
}
