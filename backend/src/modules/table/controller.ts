import { Request, Response } from 'express';
import { PaginationQuery, ApiResponse } from '../../common';
import { SwapRequest, SelectionRequest } from './types';
import { ITableService } from './interfaces';

export class TableController {
  constructor(private tableService: ITableService) {}

  private parsePaginationQuery(req: Request): PaginationQuery {
    return {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      search: (req.query.search as string) || undefined,
    };
  }

  private handleError(res: Response, error: any): void {
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Internal server error',
    };
    res.status(400).json(response);
  }

  private sendSuccess<T>(res: Response, data: T): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };
    res.json(response);
  }

  async getItems(req: Request, res: Response): Promise<void> {
    try {
      const query = this.parsePaginationQuery(req);
      const result = await this.tableService.getItems(query);
      this.sendSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateSelection(req: Request, res: Response): Promise<void> {
    try {
      const request: SelectionRequest = req.body;
      await this.tableService.updateSelection(request);
      this.sendSuccess(res, { message: 'Selection updated' });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async swapItems(req: Request, res: Response): Promise<void> {
    try {
      const request: SwapRequest = req.body;
      await this.tableService.swapItems(request);
      this.sendSuccess(res, { message: 'Items swapped successfully' });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
