import express from 'express';
import { criarChamado, listarChamados, listaChamadoPorId, atualizarStatusChamado, deletarChamado, obterStatusChamado, aceitarChamado, cancelarChamado, recusarChamado, obterIdGuincheiro, avaliarChamado,listarChamadosPorCliente, atualizarEnderecosChamadosExistentes, detalheChamados, obterChamadosEmAndamento, calcularPreco,listarGuincheirosDisponiveis, escolherGuincheiro } from '../controllers/ChamadoController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', criarChamado);
router.get('/', listarChamados);

// Rotas específicas
router.get('/andamento', obterChamadosEmAndamento);
router.get('/cliente/meus/:id', listarChamadosPorCliente);
// router.put('/atualizar-enderecos', atualizarEnderecosChamadosExistentes);
router.post('/calcularPreco', calcularPreco);
router.post('/avaliar', avaliarChamado);
router.get('/obter/:chamado_id', obterIdGuincheiro);
router.get('/detalhes/:id', detalheChamados);

// Rotas com parâmetros
router.get('/:id/guincheiros-disponiveis', listarGuincheirosDisponiveis);
router.post('/:id/escolher-guincheiro', escolherGuincheiro);
router.get('/:id/status', obterStatusChamado);
router.post('/:id/aceitar', aceitarChamado);
router.post('/:id/recusar', recusarChamado);
router.patch('/:id/cancelar', cancelarChamado);
router.patch('/:id', atualizarStatusChamado);

// Rota genérica para buscar chamado por ID
router.get('/:id', listaChamadoPorId);

export default router;