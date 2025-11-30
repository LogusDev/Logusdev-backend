import express from 'express';
import { getMessages, createMessage } from '../controllers/MensagemController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:callId', getMessages);
router.post('/', createMessage);

export default router;

