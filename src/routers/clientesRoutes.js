import express from 'express'
import { criarCliente, atualizaCliente, deletaCliente, buscaCliente, buscaClientePorId, loginCliente, resetSenhaCliente } from '../controllers/ClienteController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import { uploadFotoCliente } from '../controllers/uploadController.js';


const router = express.Router();

router.get('/',  buscaCliente);
router.get('/:id', buscaClientePorId);
router.post('/', criarCliente);
router.put('/reset-senha', resetSenhaCliente);
router.put('/:id', atualizaCliente);
router.delete('/:id', deletaCliente);
router.post('/login', loginCliente);
router.post('/:email/upload-foto',upload.single('foto'),uploadFotoCliente);


export default router


