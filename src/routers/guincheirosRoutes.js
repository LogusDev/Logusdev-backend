import express from 'express';
import { criarGuincheiro, atualizaGuincheiro, deletaGuincheiro, buscaGuincheiro, buscaGuincheiroPorId, loginGuincheiro } from "../controllers/GuincheiroController.js";

const router = express.Router();

router.post('/login', loginGuincheiro);
router.get('/', buscaGuincheiro);
router.get('/:id', buscaGuincheiroPorId);
router.post('/', criarGuincheiro);
router.put('/:id', atualizaGuincheiro);
router.delete('/:id', deletaGuincheiro);


export default router