import { config } from '../../core/config';
import { logger, PaginationQuery, PaginationResult } from '../../common';
import { TableItem } from './types';
import { ITableRepository } from './interfaces';
import { ITitleGeneratorService } from './services/title-generator.service';

export class TableRepository implements ITableRepository {
  private selectedIds = new Set<number>();
  private sortOrder: number[] = [];

  constructor(private readonly titleGenerator: ITitleGeneratorService) {
    this.initializeSortOrder();
    logger.info(
      `TableRepository initialized for ${config.tableSize.toLocaleString()} items`
    );
  }

  private initializeSortOrder(): void {
    this.sortOrder = Array.from({ length: config.tableSize }, (_, i) => i + 1);
  }

  private generateItem(id: number): TableItem {
    const randomTitle = this.titleGenerator.generateTitle(id);
    return {
      id,
      value: `Item ${id} - ${randomTitle}`,
      selected: this.selectedIds.has(id),
    };
  }

  async getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>> {
    let filteredIds = this.sortOrder;

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredIds = this.sortOrder.filter((id) => {
        const randomTitle = this.titleGenerator.generateTitle(id);
        const fullTitle = `Item ${id} - ${randomTitle}`;
        return (
          fullTitle.toLowerCase().includes(searchTerm) ||
          randomTitle.toLowerCase().includes(searchTerm) ||
          id.toString().includes(searchTerm)
        );
      });
    }

    const total = filteredIds.length;
    const startIndex = (query.page - 1) * query.limit;
    const endIndex = Math.min(startIndex + query.limit, total);

    const pageIds = filteredIds.slice(startIndex, endIndex);
    const data = pageIds.map((id) => this.generateItem(id));

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async updateSelection(itemIds: number[], selected: boolean): Promise<void> {
    itemIds.forEach((id) => {
      if (id > 0 && id <= config.tableSize) {
        if (selected) {
          this.selectedIds.add(id);
        } else {
          this.selectedIds.delete(id);
        }
      }
    });

    logger.debug(`Updated selection for ${itemIds.length} items`, {
      selected,
      totalSelected: this.selectedIds.size,
    });
  }

  async swapItems(itemId1: number, itemId2: number): Promise<void> {
    const index1 = this.sortOrder.indexOf(itemId1);
    const index2 = this.sortOrder.indexOf(itemId2);

    if (index1 === -1 || index2 === -1) {
      logger.warn(`Cannot swap items: ${itemId1} or ${itemId2} not found`);
      return;
    }

    [this.sortOrder[index1], this.sortOrder[index2]] = [
      this.sortOrder[index2],
      this.sortOrder[index1],
    ];

    logger.debug(`Swapped items ${itemId1} ⇄ ${itemId2}`, {
      position1: index1,
      position2: index2,
    });
  }
}
