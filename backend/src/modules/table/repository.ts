import { config } from '../../core/config';
import { logger, PaginationQuery, PaginationResult } from '../../common';
import { TableItem } from './types';
import { ITableRepository } from './interfaces';

export class TableRepository implements ITableRepository {
  private selectedIds = new Set<number>();
  private sortOrder: number[] = [];
  private titleCache = new Map<number, string>();

  private readonly adjectives = [
    'orange',
    'blue',
    'green',
    'red',
    'purple',
    'yellow',
    'pink',
    'black',
    'white',
    'bright',
    'dark',
    'light',
    'heavy',
    'tiny',
    'huge',
    'small',
    'large',
    'medium',
    'shiny',
    'dull',
    'smooth',
    'rough',
    'soft',
    'hard',
    'warm',
    'cold',
    'hot',
    'fast',
    'slow',
    'quick',
    'lazy',
    'active',
    'quiet',
    'loud',
    'silent',
    'beautiful',
    'ugly',
    'cute',
    'scary',
    'funny',
    'serious',
    'happy',
    'sad',
    'amazing',
    'boring',
    'interesting',
    'strange',
    'weird',
    'normal',
    'special',
    'magic',
    'secret',
    'hidden',
    'visible',
    'transparent',
    'solid',
    'liquid',
    'ancient',
    'modern',
    'old',
    'new',
    'fresh',
    'stale',
    'clean',
    'dirty',
  ];

  private readonly nouns = [
    'object',
    'thing',
    'item',
    'element',
    'widget',
    'gadget',
    'tool',
    'device',
    'box',
    'ball',
    'cube',
    'sphere',
    'cylinder',
    'triangle',
    'square',
    'circle',
    'cat',
    'dog',
    'bird',
    'fish',
    'elephant',
    'mouse',
    'rabbit',
    'tiger',
    'book',
    'pen',
    'paper',
    'computer',
    'phone',
    'chair',
    'table',
    'lamp',
    'car',
    'bike',
    'train',
    'plane',
    'boat',
    'rocket',
    'spaceship',
    'robot',
    'tree',
    'flower',
    'grass',
    'stone',
    'mountain',
    'river',
    'ocean',
    'cloud',
    'star',
    'moon',
    'sun',
    'planet',
    'galaxy',
    'universe',
    'world',
    'earth',
    'crystal',
    'diamond',
    'gem',
    'treasure',
    'coin',
    'key',
    'lock',
    'door',
  ];

  private readonly phrases = [
    "it's very nice",
    'absolutely perfect',
    'quite interesting',
    'really cool',
    'super awesome',
    'totally amazing',
    'very special',
    'extremely rare',
    'incredibly useful',
    'surprisingly good',
    'unexpectedly fun',
    'rather strange',
    'completely normal',
    'perfectly fine',
    'obviously important',
    'clearly valuable',
    'definitely unique',
    'probably magical',
    'certainly mysterious',
    'possibly ancient',
    'undoubtedly powerful',
    'remarkably beautiful',
    'exceptionally bright',
    'unusually quiet',
    'wonderfully smooth',
    'delightfully soft',
    'impressively large',
    'adorably small',
  ];

  constructor() {
    this.initializeSortOrder();
    logger.info(
      `TableRepository initialized for ${config.tableSize.toLocaleString()} items`
    );
  }

  private initializeSortOrder(): void {
    this.sortOrder = Array.from({ length: config.tableSize }, (_, i) => i + 1);
  }

  private getSeededRandom(id: number, multiplier: number = 1): number {
    const seed = id * 9301 + 49297 + multiplier * 1231;
    return (seed % 233280) / 233280;
  }

  private generateRandomTitle(id: number): string {
    if (this.titleCache.has(id)) {
      const cachedTitle = this.titleCache.get(id);
      if (cachedTitle) {
        return cachedTitle;
      }
    }

    const random1 = this.getSeededRandom(id, 1);
    const random2 = this.getSeededRandom(id, 2);
    const random3 = this.getSeededRandom(id, 3);
    const random4 = this.getSeededRandom(id, 4);

    const titleType = Math.floor(random1 * 4);
    let title: string;

    switch (titleType) {
      case 0: {
        const adjIndex = Math.floor(random2 * this.adjectives.length);
        const nounIndex = Math.floor(random3 * this.nouns.length);
        title = `${this.adjectives[adjIndex]} ${this.nouns[nounIndex]}`;
        break;
      }
      case 1: {
        const phraseIndex = Math.floor(random2 * this.phrases.length);
        title = this.phrases[phraseIndex];
        break;
      }
      case 2: {
        const adj1Index = Math.floor(random2 * this.adjectives.length);
        const adj2Index = Math.floor(random3 * this.adjectives.length);
        const noun2Index = Math.floor(random4 * this.nouns.length);
        if (adj1Index !== adj2Index) {
          title = `${this.adjectives[adj1Index]} and ${this.adjectives[adj2Index]} ${this.nouns[noun2Index]}`;
        } else {
          title = `very ${this.adjectives[adj1Index]} ${this.nouns[noun2Index]}`;
        }
        break;
      }
      default: {
        const specialAdj = Math.floor(random2 * this.adjectives.length);
        const specialNoun = Math.floor(random3 * this.nouns.length);
        const prefixes = ['super', 'mega', 'ultra', 'mini', 'micro', 'giga'];
        const prefixIndex = Math.floor(random4 * prefixes.length);
        title = `${prefixes[prefixIndex]} ${this.adjectives[specialAdj]} ${this.nouns[specialNoun]}`;
        break;
      }
    }

    this.titleCache.set(id, title);
    logger.debug(`Generated title for item ${id}: "${title}"`);
    return title;
  }

  private generateItem(id: number): TableItem {
    const randomTitle = this.generateRandomTitle(id);
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
        const randomTitle = this.generateRandomTitle(id);
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
