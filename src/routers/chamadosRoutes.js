import express from 'express';
import { criarChamado, listarChamados, listaChamadoPorId, atualizarStatusChamado, deletarChamado, obterStatusChamado, aceitarChamado, cancelarChamado, obterIdGuincheiro, avaliarChamado,listarChamadosPorCliente, detalheChamados, obterChamadosEmAndamento, calcularPreco } from '../controllers/ChamadoController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', criarChamado);
router.get('/', listarChamados);

router.get('/andamento', obterChamadosEmAndamento);
router.get('/obter/:id', obterIdGuincheiro);
router.get('/detalhes/:id', detalheChamados); //verificar necessidade
router.get('/:id', listaChamadoPorId);
router.post('/avaliar', avaliarChamado);

router.get('/cliente/meus', verifyJWT, listarChamadosPorCliente);

router.get('/:id/status', obterStatusChamado);
router.post('/:id/aceitar', aceitarChamado);
router.patch('/:id/cancelar', cancelarChamado);

// router.put('/atualizar-enderecos', atualizarEnderecosChamadosExistentes);
router.post('/calcularPreco', calcularPreco);

export default router;