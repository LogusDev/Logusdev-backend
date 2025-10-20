import express from 'express';
import { adicionarVeiculo, buscaVeiculo, buscaVeiculoPorId, deletaVeiculo } from '../controllers/VeiculoController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyJWT, buscaVeiculo);
router.get('/:id', verifyJWT, buscaVeiculoPorId);
router.post('/', verifyJWT, adicionarVeiculo);
router.delete('/:id', deletaVeiculo);

export default router