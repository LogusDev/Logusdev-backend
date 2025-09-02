import Avaliacao from "../models/Avaliacao.js";
import Chamado from "../models/Chamado.js";
import Guincheiro from "../models/Guincheiro.js";

export const criarChamado = async (req, res) => {
  try {
    const {
      latitude_inicial, longitude_inicial,
      latitude_final, longitude_final,
      descricao, carro_id, cliente_id
    } = req.body;

    const chamado = await Chamado.create({
      latitude_inicial,
      longitude_inicial,
      latitude_final,
      longitude_final,
      descricao,
      carro_id,
      cliente_id,
      status_chamado: 'aguardando',     // default seguro
      requisitado_em: new Date(),
      guincheiro_id: null,
    });

    res.status(201).json(chamado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarChamados = async (req, res) => {
    try {
        const chamados = await Chamado.findAll();
        res.status(200).json(chamados)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const listaChamadoPorId = async (req, res) => {
    try {
        const chamado = await Chamado.findByPk(req.params.id);
        if (!chamado) {
            return res.status(404).json({error: "Chamado não encontrado!"})
        }
        res.status(200).json(chamado);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const atualizarStatusChamado = async (req, res) => {
    try {
        const chamado = await Chamado.findByPk(req.params.id);
        if (!chamado) {
            return res.status(404).json({error: "Chamado não encontrado!"});
        }
        const { status_chamado } = req.body;
        chamado.status_chamado = status_chamado;
        if (status_chamado === 'concluído') {
            chamado.completado_em = new Date();
        }

        await chamado.save();
        res.status(200).json(chamado);

    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const deletarChamado = async (req, res) => {
    try {
        const chamado = await Chamado.findByPk(req.params.id);
    if (!chamado) {
        return res.status(404).json({error: "Chamado não encontrado!"});
    }
    await chamado.destroy();
    res.status(204).send("Chamado Deletado com Sucesso!");
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
}

export const obterStatusChamado = async (req, res) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id, {
      attributes: ['id', 'status_chamado', 'guincheiro_id', 'updatedAt'],
    });
    if (!chamado) return res.status(404).json({ error: 'Chamado não encontrado' });
    return res.json(chamado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const aceitarChamado = async (req, res) => {
  try {
    const { guincheiro_id } = req.body;
    if (!guincheiro_id) return res.status(400).json({ error: 'guincheiro_id obrigatório' });

    const [count] = await Chamado.update(
      { guincheiro_id, status_chamado: 'em andamento' },
      {
        where: {
          id: req.params.id,
          status_chamado: 'aguardando',
          guincheiro_id: null,
        },
      }
    );

    if (!count) return res.status(409).json({ error: 'Chamado já aceito/cancelado' });

    const atualizado = await Chamado.findByPk(req.params.id, {
      attributes: ['id', 'status_chamado', 'guincheiro_id', 'updatedAt'],
    });
    return res.json(atualizado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cancelarChamado = async (req, res) => {
  try {
    const [count] = await Chamado.update(
      { status_chamado: 'cancelado' },
      { where: { id: req.params.id, status_chamado: 'aguardando' } }
    );
    if (!count) return res.status(409).json({ error: 'Não é possível cancelar agora' });
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Presume-se que os seus models do Sequelize (Chamado, Avaliacao) estão importados.

export const avaliarChamado = async (req, res) => {
  try {
    // 1. O 'cliente_id' não é mais recebido do frontend.
    const { comentario, chamado_id, nota } = req.body;
    
    // 2. Validação agora é apenas para os campos que vêm do frontend.
    if (!chamado_id || !nota) {
      return res.status(400).json({ error: 'Os campos chamado_id e nota são obrigatórios.' });
    }

    // 3. Busca o chamado no banco de dados.
    const chamado = await Chamado.findByPk(chamado_id);
    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    // 4. O 'cliente_id' é obtido diretamente do objeto 'chamado' que veio do banco.
    // Esta é a fonte segura da informação.
    const cliente_id = chamado.cliente_id;

    if (chamado.status_chamado !== "concluido") {
      return res.status(400).json({ error: "Este chamado ainda não foi concluído!" });
    }

     // 5. A verificação usa o 'cliente_id' seguro, obtido do próprio chamado.
     const avaliacaoExiste = await Avaliacao.findOne({
      where: { 
        chamado_id: chamado_id, 
        cliente_id: cliente_id 
      }
     });

     if (avaliacaoExiste) {
       return res.status(409).json({ error: "Você já avaliou este chamado!" });
     }

     // 6. A nova avaliação é criada com o 'cliente_id' seguro.
     const novaAvaliacao = await Avaliacao.create({
      nota,
      comentario,
      chamado_id: chamado_id,
      cliente_id: cliente_id, 
      guincheiro_id: chamado.guincheiro_id,
      data_avaliacao: new Date()
     });

     res.status(201).json(novaAvaliacao);

  } catch (error) {
    console.error('Erro ao avaliar chamado:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
}



export const obterIdGuincheiro = async (req, res) => {
  try {
    const { chamado_id } = req.params;
    console.log(chamado_id);

    const chamado = await Chamado.findOne({
      where: { id: chamado_id },
      include: [{
        model: Guincheiro,
        as: 'guincheiro'
      }]  
    });

    if (!chamado || !chamado.guincheiro) {
      return res.status(404).json({ error: 'Guincheiro não encontrado para este chamado' });
    }

    res.status(200).json({ guincheiro: chamado.guincheiro });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};