import { Request, Response } from 'express';
import { PaginationQuery, ApiResponse } from '../../common';
import { InsertRequest, SelectionRequest } from './types';
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

  private handleError(res: Response, error: unknown): void {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
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

  async insertItem(req: Request, res: Response): Promise<void> {
    try {
      const request: InsertRequest = req.body;
      await this.tableService.insertItem(request);
      this.sendSuccess(res, { message: 'Item moved successfully' });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
