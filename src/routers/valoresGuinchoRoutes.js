import { Router } from 'express';
import { 
    criarValoresGuincho, 
    buscarValoresPorGuincheiro, 
    buscarValorAtualPorGuincheiro,
    atualizarValoresGuincho 
} from '../controllers/ValoresGuinchoController.js';

const router = Router();

router.post('/', criarValoresGuincho);                                    // POST /valores-guincho
router.get('/guincheiro/:idGuincheiro', buscarValoresPorGuincheiro);      // GET /valores-guincho/guincheiro/:idGuincheiro
router.get('/guincheiro/:idGuincheiro/atual', buscarValorAtualPorGuincheiro); // GET /valores-guincho/guincheiro/:idGuincheiro/atual
router.put('/:id', atualizarValoresGuincho);                              // PUT /valores-guincho/:id

export default router;





