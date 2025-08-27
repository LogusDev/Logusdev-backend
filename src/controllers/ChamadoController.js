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