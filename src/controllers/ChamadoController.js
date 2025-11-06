import Avaliacao from "../models/Avaliacao.js";
import Chamado from "../models/Chamado.js";
import Cliente from "../models/Cliente.js";
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



export const avaliarChamado = async (req, res) => {
  try {
    const { comentario, chamado_id, nota } = req.body;
    
    if (!chamado_id || !nota) {
      return res.status(400).json({ error: 'Os campos chamado_id e nota são obrigatórios.' });
    }

    const chamado = await Chamado.findByPk(chamado_id);
    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }


    const cliente_id = chamado.cliente_id;

    if (chamado.status_chamado !== "concluido") {
      return res.status(400).json({ error: "Este chamado ainda não foi concluído!" });
    }


     const avaliacaoExiste = await Avaliacao.findOne({
      where: { 
        chamado_id: chamado_id, 
        cliente_id: cliente_id 
      }
     });

     if (avaliacaoExiste) {
       return res.status(409).json({ error: "Você já avaliou este chamado!" });
     }

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

export const obterChamadosEmAndamento = async (req, res) => {
  try {
    const chamados = await Chamado.findAll({
      where: { status_chamado: 'em andamento' },
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome'] }],
      order: [['requisitado_em', 'ASC']]
    });

    const now = Date.now();

    const formatDuration = (minutes) => {
      if (minutes < 1) return '<1min';
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hrs === 0) return `${mins}min`;
      if (mins === 0) return `${hrs}h`;
      return `${hrs}h ${mins}min`;
    };

    const resultado = chamados.map(c => {
      const requisitado = new Date(c.requisitado_em).getTime();
      const minutosEspera = Math.max(0, Math.floor((now - requisitado) / 60000));
      return {
        id: c.id,
        cliente_nome: c.cliente?.nome ?? null,
        minutos_espera: minutosEspera,
        tempo_espera_formatado: formatDuration(minutosEspera),
        requisitado_em: c.requisitado_em,
        descricao: c.descricao,
        latitude_inicial: c.latitude_inicial,
        longitude_inicial: c.longitude_inicial
      };
    });

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const detalheChamados = async (req, res) => {
    try {

        const chamado = await Chamado.findByPk(req.params.id, {
          include: [
            { model: Cliente, as: 'cliente', include: [{ model: Veiculo, as: 'veiculo' }] },
          ]
        });
        if (!chamado) {
            return res.status(404).json({error: "Chamado não encontrado!"})
        }

        const detalhe = {
          id: chamado.id,
          descricao: chamado.descricao,
          requisitado_em: chamado.requisitado_em,
          carro: chamado.cliente?.veiculo,
          valor: chamado.valor,
          metodo_pagamento: chamado.metodo_pagamento,
          endereco_inicio: chamado.endereco_inicial,
          endereco_destino: chamado.endereco_final,
          coordenadas_inicio: {
            latitude: chamado.latitude_inicial,
            longitude: chamado.longitude_inicial
          },
          coordenadas_destino: {
            latitude: chamado.latitude_final,
            longitude: chamado.longitude_final
          }
        };

        res.status(200).json(detalhe);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};