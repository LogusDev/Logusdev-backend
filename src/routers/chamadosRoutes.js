import express from 'express';
import { criarChamado, listarChamados, listaChamadoPorId, atualizarStatusChamado, deletarChamado, obterStatusChamado, aceitarChamado, cancelarChamado, obterIdGuincheiro, avaliarChamado, obterChamadosEmAndamento, detalheChamados } from '../controllers/ChamadoController.js';

const router = express.Router();

router.post('/', criarChamado);
router.get('/', listarChamados);

router.get('/andamento', obterChamadosEmAndamento);
router.get('/obter/:chamado_id', obterIdGuincheiro);
router.get('/detalhes', detalheChamados);
router.post('/avaliar', avaliarChamado);

router.get('/:id/status', obterStatusChamado);
router.post('/:id/aceitar', aceitarChamado);
router.patch('/:id/cancelar', cancelarChamado);
router.patch('/:id', atualizarStatusChamado);
router.delete('/:id', deletarChamado);

router.get('/:id', listaChamadoPorId);

export default router;