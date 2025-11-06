import { Router } from 'express';
import { buscaGuincho, buscaGuinchoPorId, buscaGuinchosPorGuincheiro, adicionarGuincho } from '../controllers/GuinchoController.js';

const router = Router();

router.get('/', buscaGuincho);                          // GET /guinchos
router.get('/:id', buscaGuinchoPorId);                  // GET /guinchos/:id (guincho por PK)
router.get('/guincheiro/:id', buscaGuinchosPorGuincheiro); // GET /guinchos/guincheiro/:id (guinchos de um guincheiro)  
router.post('/', adicionarGuincho);

// opcional: todos os guinchos de um guincheiro
// preferível: /guincheiros/:id/guinchos (colocar esta rota no guincheirosRoutes)
export default router;