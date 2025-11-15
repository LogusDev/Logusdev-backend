import express from 'express';
import { criarChamado, listarChamados, listaChamadoPorId, atualizarStatusChamado, deletarChamado, obterStatusChamado, aceitarChamado, cancelarChamado, obterIdGuincheiro, avaliarChamado,listarChamadosPorCliente, atualizarEnderecosChamadosExistentes, detalheChamados, obterChamadosEmAndamento, calcularPreco } from '../controllers/ChamadoController.js';

const router = express.Router();

router.post('/', criarChamado);
router.get('/', listarChamados);

router.get('/andamento', obterChamadosEmAndamento);
router.get('/obter/:chamado_id', obterIdGuincheiro);
router.get('/detalhes/:id', detalheChamados);
router.post('/avaliar', avaliarChamado);

router.get('/:id/status', obterStatusChamado);
router.post('/:id/aceitar', aceitarChamado);
router.patch('/:id/cancelar', cancelarChamado);
router.post('/avaliar', avaliarChamado);

router.get('/cliente/meus', listarChamadosPorCliente);
router.put('/atualizar-enderecos', atualizarEnderecosChamadosExistentes);
router.post('/calcularPreco', calcularPreco);

export default router;