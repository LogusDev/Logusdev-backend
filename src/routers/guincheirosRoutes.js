import express from 'express';
import { criarGuincheiro, atualizaGuincheiro, deletaGuincheiro, buscaGuincheiro, buscaGuincheiroPorId, loginGuincheiro } from "../controllers/GuincheiroController.js";
import { uploadFotoGuincheiro } from '../controllers/uploadController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', buscaGuincheiro);
router.get('/:id', buscaGuincheiroPorId);
router.post('/', criarGuincheiro);
router.put('/:id', atualizaGuincheiro);
router.delete('/:id', deletaGuincheiro);
router.post('/login', loginGuincheiro);
router.post('/:email/upload-foto', upload.single('foto'), uploadFotoGuincheiro);

export default router