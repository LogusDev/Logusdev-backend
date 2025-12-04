import { Router } from 'express';
import verifyJWT from '../middlewares/authMiddleware.js';
import {
  buscaGuincho,
  buscaGuinchoPorId,
  buscaGuinchosPorGuincheiro,
  adicionarGuincho,
  editarGuincho,
  deletarGuincho,
  listaModelosGuincho,
  selecionarGuinchoAtual
} from '../controllers/GuinchoController.js';


const router = Router();

router.get('/modelos', listaModelosGuincho); 
router.get('/guincheiro/:id', buscaGuinchosPorGuincheiro);
router.get('/', buscaGuincho);
router.get('/:id', buscaGuinchoPorId);
router.post('/', adicionarGuincho);
router.put('/:id', editarGuincho);
router.delete('/:id', deletarGuincho);
router.put('/:guinchoId/selecionar', verifyJWT, selecionarGuinchoAtual);



export default router;
