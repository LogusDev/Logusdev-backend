import express from 'express';
import { criarChamado, listarChamados, listaChamadoPorId, atualizarStatusChamado, deletarChamado, obterStatusChamado, aceitarChamado, cancelarChamado, obterIdGuincheiro, avaliarChamado,listarChamadosPorCliente, listarChamadosPorGuincheiro, detalheChamados, obterChamadosEmAndamento, calcularPreco } from '../controllers/ChamadoController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', criarChamado);
router.get('/', listarChamados);

// Rotas específicas devem vir antes das rotas com parâmetros
router.get('/andamento', obterChamadosEmAndamento);
router.get('/cliente/meus/:id', listarChamadosPorCliente);
router.get('/guincheiro/meus/:id', listarChamadosPorGuincheiro);
// router.put('/atualizar-enderecos', atualizarEnderecosChamadosExistentes);
router.post('/calcularPreco', calcularPreco);
router.post('/avaliar', avaliarChamado);

// Rotas com parâmetros específicos
router.get('/obter/:chamado_id', obterIdGuincheiro);
router.get('/detalhes/:id', detalheChamados);
router.get('/:id/status', obterStatusChamado);
router.post('/:id/aceitar', aceitarChamado);
router.patch('/:id/cancelar', cancelarChamado);
router.patch('/:id', atualizarStatusChamado);

// Rota genérica para buscar chamado por ID (deve vir por último)
router.get('/:id', listaChamadoPorId);

export default router;