import { logger } from '../../../common';
import { ADJECTIVES, NOUNS, PHRASES, PREFIXES } from '../constants/title-data';

export interface ITitleGeneratorService {
  generateTitle(id: number): string;
}

export class TitleGeneratorService implements ITitleGeneratorService {
  private readonly titleCache = new Map<number, string>();

  private getSeededRandom(id: number, multiplier: number = 1): number {
    const seed = id * 9301 + 49297 + multiplier * 1231;
    return (seed % 233280) / 233280;
  }

  generateTitle(id: number): string {
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
        const adjIndex = Math.floor(random2 * ADJECTIVES.length);
        const nounIndex = Math.floor(random3 * NOUNS.length);
        title = `${ADJECTIVES[adjIndex]} ${NOUNS[nounIndex]}`;
        break;
      }
      case 1: {
        const phraseIndex = Math.floor(random2 * PHRASES.length);
        title = PHRASES[phraseIndex];
        break;
      }
      case 2: {
        const adj1Index = Math.floor(random2 * ADJECTIVES.length);
        const adj2Index = Math.floor(random3 * ADJECTIVES.length);
        const noun2Index = Math.floor(random4 * NOUNS.length);
        if (adj1Index !== adj2Index) {
          title = `${ADJECTIVES[adj1Index]} and ${ADJECTIVES[adj2Index]} ${NOUNS[noun2Index]}`;
        } else {
          title = `very ${ADJECTIVES[adj1Index]} ${NOUNS[noun2Index]}`;
        }
        break;
      }
      default: {
        const specialAdj = Math.floor(random2 * ADJECTIVES.length);
        const specialNoun = Math.floor(random3 * NOUNS.length);
        const prefixIndex = Math.floor(random4 * PREFIXES.length);
        title = `${PREFIXES[prefixIndex]} ${ADJECTIVES[specialAdj]} ${NOUNS[specialNoun]}`;
        break;
      }
    }

    this.titleCache.set(id, title);
    logger.debug(`Generated title for item ${id}: "${title}"`);
    return title;
  }
}
