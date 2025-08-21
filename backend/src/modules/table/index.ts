import { container } from '../../core/di-container';
import { TableRepository } from './repository';
import { TableService } from './service';
import { TableController } from './controller';
import { ITableRepository, ITableService } from './interfaces';
import { createTableRoutes } from './routes';

export function registerTableModule(): void {
  container.register<ITableRepository>(
    'TableRepository',
    () => new TableRepository()
  );

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
