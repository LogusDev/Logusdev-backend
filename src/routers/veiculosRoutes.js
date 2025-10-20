import express from 'express';
import { adicionarVeiculo, atualizaVeiculo, buscaVeiculo, buscaVeiculoPorId, deletaVeiculo } from '../controllers/VeiculoController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyJWT, buscaVeiculo);
router.get('/:id', verifyJWT, buscaVeiculoPorId);
router.post('/', verifyJWT, adicionarVeiculo);
router.put('/:id', verifyJWT, atualizaVeiculo)
router.delete('/:id', deletaVeiculo);

export default router