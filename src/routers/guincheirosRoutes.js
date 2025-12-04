import express from 'express';
import { criarGuincheiro, atualizaGuincheiro, deletaGuincheiro, buscaGuincheiro, buscaGuincheiroPorId, loginGuincheiro, trocarSenhaGuincheiro } from "../controllers/GuincheiroController.js";
import { uploadFotoGuincheiro } from '../controllers/uploadController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/login', loginGuincheiro);
router.get('/', buscaGuincheiro);
router.get('/:id', buscaGuincheiroPorId);
router.post('/', criarGuincheiro);
router.put('/:id', atualizaGuincheiro);
router.delete('/:id', deletaGuincheiro);
router.post('/:email/upload-foto', upload.single('foto'), uploadFotoGuincheiro);
router.put("/update-password/:id", trocarSenhaGuincheiro);

export default router