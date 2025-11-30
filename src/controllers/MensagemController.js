import Mensagem from "../models/Mensagem.js";
import Chamado from "../models/Chamado.js";

export const getMessages = async (req, res) => {
  try {
    const { callId } = req.params;

    const messages = await Mensagem.findAll({
      where: {
        chamado_id: callId
      },
      order: [['created_at', 'ASC']]
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { callId, message, senderId, senderName, senderType } = req.body;

    // Verificar se o chamado existe
    const chamado = await Chamado.findByPk(callId);
    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    const novaMensagem = await Mensagem.create({
      chamado_id: callId,
      mensagem: message,
      sender_id: senderId,
      sender_nome: senderName,
      sender_tipo: senderType
    });

    return res.status(201).json(novaMensagem);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    return res.status(500).json({ error: 'Erro ao criar mensagem' });
  }
};

