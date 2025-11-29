import express from 'express';
import { adicionarVeiculo, atualizaVeiculo, buscaVeiculo, buscaVeiculoPorId, deletaVeiculo, selecionarVeiculoAtual } from '../controllers/VeiculoController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', buscaVeiculo);
router.get('/:id', buscaVeiculoPorId);
router.post('/', adicionarVeiculo);
router.put('/:id', atualizaVeiculo)
router.delete('/:id', deletaVeiculo);
router.put('/:veiculoId/selecionar', selecionarVeiculoAtual);

export default router