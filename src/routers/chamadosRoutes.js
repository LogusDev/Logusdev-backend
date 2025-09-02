import express from 'express';
import { criarChamado, listarChamados, listaChamadoPorId, atualizarStatusChamado, deletarChamado, obterStatusChamado, aceitarChamado, cancelarChamado, obterIdGuincheiro, avaliarChamado } from '../controllers/ChamadoController.js';

const router = express.Router();

  // Base: /chamados
router.post('/', criarChamado);
router.get('/', listarChamados);
router.get('/:id', listaChamadoPorId);
router.patch('/:id', atualizarStatusChamado);
router.delete('/:id', deletarChamado);
router.get('/obter/:chamado_id', obterIdGuincheiro);
router.get('/:id/status', obterStatusChamado);
router.post('/:id/aceitar', aceitarChamado);
router.patch('/:id/cancelar', cancelarChamado);
router.post('/avaliar', avaliarChamado);

export default router;