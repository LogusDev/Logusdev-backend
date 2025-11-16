import Avaliacao from "../models/Avaliacao.js";
import Chamado from "../models/Chamado.js";
import Cliente from "../models/Cliente.js";
import Guincheiro from "../models/Guincheiro.js";
import Veiculo from "../models/Veiculo.js";
import getAddressFromCoords from "../services/geocode.js";
import { Op } from "sequelize";
import { calculateFareSimple } from "../helpers/value.js";
import { calcularDistancia } from "../helpers/geoloc.js";

export const criarChamado = async (req, res) => {
  try {
    const {
      latitude_inicial, longitude_inicial,
      latitude_final, longitude_final,
      descricao, carro_id, cliente_id,metodo_pagamento
    } = req.body;

    // Converter coordenadas para números (caso venham como strings)
    const latInicial = parseFloat(latitude_inicial);
    const lngInicial = parseFloat(longitude_inicial);
    const latFinal = parseFloat(latitude_final);
    const lngFinal = parseFloat(longitude_final);

    console.log("📍 Coordenadas recebidas:", {
      inicial: { lat: latInicial, lng: lngInicial },
      final: { lat: latFinal, lng: lngFinal }
    });

    // Converter coordenadas para endereços
    console.log("🔄 Convertendo coordenadas iniciais para endereço...");
    const endereco_inicial = await getAddressFromCoords(latInicial, lngInicial);
    console.log("✅ Endereço inicial:", endereco_inicial || "❌ Não foi possível obter");

    console.log("🔄 Convertendo coordenadas finais para endereço...");
    const endereco_final = await getAddressFromCoords(latFinal, lngFinal);
    console.log("✅ Endereço final:", endereco_final || "❌ Não foi possível obter");

    const fareData = calculateFareSimple({
      lat1: latInicial,
      lon1: lngInicial,
      lat2: latFinal,
      lon2: lngFinal
    });

    const chamado = await Chamado.create({
      latitude_inicial: latInicial,
      longitude_inicial: lngInicial,
      latitude_final: latFinal,
      longitude_final: lngFinal,
      endereco_inicial,
      endereco_final, 
      descricao,
      carro_id,
      cliente_id,
      status_chamado: 'aguardando', 
      requisitado_em: new Date(),
      guincheiro_id: null,
      preco: fareData.fare,
      metodo_pagamento: metodo_pagamento
    });

    console.log("✅ Chamado criado:", {
      id: chamado.id,
      endereco_inicial: chamado.endereco_inicial,
      endereco_final: chamado.endereco_final
    });  
    res.status(201).json(chamado);
  } catch (error) {
    console.error("❌ Erro ao criar chamado:", error);
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

export const listarChamadosPorCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    console.log("ID do cliente autenticado:", clienteId);

    const chamados = await Chamado.findAll({
      where: { cliente_id: clienteId },
      order: [['requisitado_em', 'DESC']],
      include: [ //Join para pegar o nome do guincheiro (Se precisar, do cliente também) 
        {
          model: Guincheiro,
          as: 'guincheiro',
          attributes: ['id', 'nome', 'foto_url']
        },
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'foto_url']
        },
      ],
      attributes: [
        'id',
        'latitude_inicial',
        'longitude_inicial',
        'latitude_final',
        'longitude_final',
        'endereco_inicial',
        'endereco_final',
        'requisitado_em',
        'completado_em'
      ]
    });
    res.status(200).json(chamados)
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        if (status_chamado === 'concluido') {
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
      attributes: ['id', 'status_chamado', 'guincheiro_id', 'requisitado_em'],
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
        as: 'guincheiro',
        attributes: ['id', 'nome', 'telefone', 'foto_url', 'email']
      }]  
    });

    if (!chamado || !chamado.guincheiro) {
      return res.status(404).json({ error: 'Guincheiro não encontrado para este chamado' });
    }

    // Retorna os dados completos do guincheiro
    res.status(200).json({ 
      guincheiro_id: chamado.guincheiro.id,
      guincheiro: {
        id: chamado.guincheiro.id,
        nome: chamado.guincheiro.nome,
        telefone: chamado.guincheiro.telefone,
        foto_url: chamado.guincheiro.foto_url,
        email: chamado.guincheiro.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obterChamadosEmAndamento = async (req, res) => {
    try {

        const guincheiroLocation = {
            lat: parseFloat(req.query.lat),
            lng: parseFloat(req.query.lng)
        };

        console.log("LOCAL RECEBIDA:", guincheiroLocation);

        console.log(guincheiroLocation)

        const chamados = await Chamado.findAll({
            where: { status_chamado: 'aguardando' },
            // Incluindo os 3 modelos diretamente, conforme suas associações:
            include: [
                { 
                    model: Cliente, 
                    as: 'cliente', 
                    // Precisamos de nome e foto para o card
                    attributes: ['id', 'nome', 'foto_url'] 
                },
                { 
                    model: Veiculo, 
                    as: 'veiculo', // Usando seu alias: 'veiculo'
                    // Precisamos de marca, modelo e ano para o card
                    attributes: ['marca', 'modelo', 'ano_fabricacao']
                }
                // Guincheiro não é necessário, pois o chamado 'aguardando' não tem guincheiro_id
            ],
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
            
            // 1. Informação do Veículo
            const veiculoInfo = c.veiculo ? 
                `${c.veiculo.marca} ${c.veiculo.modelo} ${c.veiculo.ano_fabricacao}` : 
                'Veículo Não Informado';

            // 2. Cálculo da Distância
            const distanciaKm = calcularDistancia(
                guincheiroLocation.lat, 
                guincheiroLocation.lng, 
                c.latitude_inicial, 
                c.longitude_inicial
            );

            return {
                id: c.id,
                
                // Cliente e Foto
                cliente_nome: c.cliente?.nome ?? null,
                cliente_foto_url: c.cliente?.foto_url ?? null, 
                
                // Veículo (Ex: Fiat Palio EX 1998)
                veiculo_info: veiculoInfo, 
                
                // Tempo (Ex: Há 1h30)
                tempo_espera_formatado: formatDuration(minutosEspera), 
                
                // Distância (Ex: 282km)
                distancia_km: distanciaKm.toFixed(0), 
                
                // Dados Originais
                requisicao_em: c.requisitado_em,
                latitude_inicial: c.latitude_inicial,
                longitude_inicial: c.longitude_inicial
            };
        });

        return res.status(200).json(resultado);
    } catch (error) {
        // Use console.error para ver detalhes no servidor
        console.error("Erro ao buscar chamados em andamento:", error.message); 
        return res.status(500).json({ error: error.message });
    }
};


export const detalheChamados = async (req, res) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nome', 'email', 'telefone', 'foto_url']
        },
        {
          model: Veiculo,
          as: 'veiculo',
          attributes: ['modelo', 'ano_fabricacao', 'placa', 'cor','marca']
        }
      ]
    });

    if (!chamado) {
      return res.status(404).json({ error: "Chamado não encontrado!" });
    }

    const detalhe = {
      id: chamado.id,
      cliente: {
        nome: chamado.cliente?.nome,
        email: chamado.cliente?.email,
        telefone: chamado.cliente?.telefone,
        foto_url: chamado.cliente?.foto_url
      },
      endereco_inicio: chamado.endereco_inicial,
      endereco_destino: chamado.endereco_final,
      coordenadas_inicio: {
        latitude: chamado.latitude_inicial,
        longitude: chamado.longitude_inicial
      },
      coordenadas_destino: {
        latitude: chamado.latitude_final,
        longitude: chamado.longitude_final
      },
      carro: chamado.veiculo
        ? {
            modelo: chamado.veiculo.modelo,
            ano: chamado.veiculo.ano_fabricacao,
            placa: chamado.veiculo.placa,
            cor: chamado.veiculo.cor,
            marca: chamado.veiculo.marca
          }
        : null,
      preco: chamado.preco,
      metodo_pagamento: chamado.metodo_pagamento,
      requisitado_em: chamado.requisitado_em
    };

    res.status(200).json(detalhe);
  } catch (error) {
    console.error("Erro ao buscar detalhes do chamado:", error);
    res.status(500).json({ error: error.message });
  }
};


export const atualizarEnderecosChamadosExistentes = async (req, res) => {
  const cliente_id = req.userId;
  console.log("== Atualizando endereços do cliente:", cliente_id);

  try {
    const chamados = await Chamado.findAll({
      where: {
        cliente_id,
        [Op.or]: [
          { endereco_inicial: null },
          { endereco_final: null },
        ],
      },
    });

    for (const chamado of chamados) {
      const endereco_inicial = chamado.endereco_inicial
        ? chamado.endereco_inicial
        : await getAddressFromCoords(chamado.latitude_inicial, chamado.longitude_inicial);

      const endereco_final = chamado.endereco_final
        ? chamado.endereco_final
        : await getAddressFromCoords(chamado.latitude_final, chamado.longitude_final);

      chamado.endereco_inicial = endereco_inicial;
      chamado.endereco_final = endereco_final;

      await chamado.save();

      console.log(`Chamado ${chamado.id} atualizado:`);
      console.log(` → Inicial: ${endereco_inicial}`);
      console.log(` → Final: ${endereco_final}`);
    }

    res.status(200).json({
      message: "Endereços atualizados com sucesso!",
      total: chamados.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const calcularPreco = async (req, res) => {
  try {
    const { latitude_inicial, longitude_inicial, latitude_final, longitude_final } = req.body;


    const fareData = calculateFareSimple({
      lat1: latitude_inicial,
      lon1: longitude_inicial,
      lat2: latitude_final,
      lon2: longitude_final
    });

    return res.json({ preco: fareData.fare });
    console.log(fareData);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};