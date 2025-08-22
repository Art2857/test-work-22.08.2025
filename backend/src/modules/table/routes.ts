import { Router } from 'express';
import { container } from '../../core/di-container';
import { TableController } from './controller';

export function createTableRoutes(): Router {
  const router = Router();
  const controller = container.get<TableController>('TableController');

  router.get('/items', (req, res) => controller.getItems(req, res));
  router.post('/selection', (req, res) => controller.updateSelection(req, res));
  router.post('/swap', (req, res) => controller.swapItems(req, res));

  return router;
}
