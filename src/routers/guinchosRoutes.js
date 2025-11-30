import { Router } from 'express';
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
import verifyJWT from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/modelos', listaModelosGuincho); 
router.get('/guincheiro/:id', buscaGuinchosPorGuincheiro);
router.get('/', buscaGuincho);
router.get('/:id', buscaGuinchoPorId);
router.post('/', verifyJWT, adicionarGuincho);
router.put('/:id', verifyJWT, editarGuincho);
router.delete('/:id', deletarGuincho);
router.put('/:guinchoId/selecionar', verifyJWT, selecionarGuinchoAtual);



export default router;
