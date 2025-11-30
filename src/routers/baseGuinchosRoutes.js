import { Router } from 'express';
import { 
    buscaBaseGuinchos, 
    buscaBaseGuinchoPorId, 
    buscaBaseGuinchosPorMarca,
    buscaBaseGuinchosPorModelo 
} from '../controllers/BaseGuinchoController.js';

const router = Router();

router.get('/', buscaBaseGuinchos);                                    // GET /base-guinchos
router.get('/:id', buscaBaseGuinchoPorId);                             // GET /base-guinchos/:id
router.get('/marca/:marca', buscaBaseGuinchosPorMarca);                // GET /base-guinchos/marca/:marca
router.get('/marca/:marca/modelo/:modelo', buscaBaseGuinchosPorModelo); // GET /base-guinchos/marca/:marca/modelo/:modelo

export default router;



