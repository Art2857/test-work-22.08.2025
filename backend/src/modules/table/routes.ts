import { Router } from 'express';
import { container } from '../../core/di-container';
import { TableController } from './controller';

export function createTableRoutes(): Router {
  const router = Router();

  const controller = container.get<TableController>('TableController');

  const boundController = {
    getItems: controller.getItems.bind(controller),
    updateSelection: controller.updateSelection.bind(controller),
    swapItems: controller.swapItems.bind(controller),
  };

  router.get('/items', boundController.getItems);
  router.post('/selection', boundController.updateSelection);
  router.post('/swap', boundController.swapItems);

  return router;
}
