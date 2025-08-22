import { container } from '../../core/di-container';
import { TableRepository } from './repository';
import { TableService } from './service';
import { TableController } from './controller';
import {
  ITableRepository,
  ITableService,
  ITitleGeneratorService,
} from './interfaces';
import { TitleGeneratorService } from './services/title-generator.service';
import { createTableRoutes } from './routes';

export function registerTableModule(): void {
  container.register<ITitleGeneratorService>(
    'TitleGeneratorService',
    () => new TitleGeneratorService()
  );

  container.register<ITableRepository>('TableRepository', () => {
    const titleGenerator = container.get<ITitleGeneratorService>(
      'TitleGeneratorService'
    );
    return new TableRepository(titleGenerator);
  });

  container.register<ITableService>('TableService', () => {
    const repository = container.get<ITableRepository>('TableRepository');
    return new TableService(repository);
  });

  container.register<TableController>('TableController', () => {
    const service = container.get<ITableService>('TableService');
    return new TableController(service);
  });
}

export { createTableRoutes };
