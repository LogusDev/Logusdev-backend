import Guincho from '../models/Guincho.js';
import BaseGuinchos from '../models/BaseGuinchos.js';

// Buscar todos os guinchos
export const buscaGuincho = async (req, res) => {
    try {
        const guinchos = await Guincho.findAll();
        return res.status(200).json(guinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Buscar guincho por ID
export const buscaGuinchoPorId = async (req, res) => {
    try {
        const guincho = await Guincho.findByPk(req.params.id);
        if (!guincho) return res.status(404).json({ error: 'Guincho não encontrado' });
        return res.status(200).json(guincho);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Buscar guinchos de um guincheiro
export const buscaGuinchosPorGuincheiro = async (req, res) => {
    try {
        const guincheiroId = Number(req.params.id);
        const guinchos = await Guincho.findAll({ where: { guincheiro_id: guincheiroId } });
        return res.status(200).json(guinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Criar guincho
export const adicionarGuincho = async (req, res) => {
  try {
    const { placa, marca, modelo, ano_fabricacao, capacidade, comprimento_plataforma, cor } = req.body;
    const guincheiroId = req.userId || req.body.guincheiro_id; // pega do token ou do body

    if (!guincheiroId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const novoGuincho = await Guincho.create({
      placa,
      marca,
      modelo,
      cor,
      ano_fabricacao,
      capacidade,
      comprimento_plataforma,
      guincheiro_id: guincheiroId
    });

    console.log('✅ [adicionarGuincho] Guincho criado com sucesso:', novoGuincho.toJSON());
    return res.status(201).json(novoGuincho);

  } catch (error) {
    console.error('❌ [adicionarGuincho] Erro ao criar guincho:', error);
    return res.status(400).json({ error: error.message });
  }
};


// Editar guincho
export const editarGuincho = async (req, res) => {
    try {
        const { id } = req.params;
        const guincheiro_id = req.userId;

        const guincho = await Guincho.findByPk(id);
        if (!guincho) return res.status(404).json({ error: 'Guincho não encontrado' });

        // Impedir que o usuário edite guinchos de outros
        if (guincho.guincheiro_id !== guincheiro_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Filtrar campos permitidos
        const camposPermitidos = [
            'placa',
            'marca',
            'modelo',
            'ano_fabricacao',
            'capacidade',
            'comprimento_plataforma'
        ];

        const dadosFiltrados = {};
        camposPermitidos.forEach(campo => {
            if (req.body.hasOwnProperty(campo)) {
                dadosFiltrados[campo] = req.body[campo];
            }
        });

        await guincho.update(dadosFiltrados);

        return res.status(200).json(guincho);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Deletar guincho
export const deletarGuincho = async (req, res) => {
    try {
        const { id } = req.params;
        const guincheiro_id = req.userId;

        const guincho = await Guincho.findByPk(id);
        if (!guincho) return res.status(404).json({ error: 'Guincho não encontrado' });

        if (guincho.guincheiro_id !== guincheiro_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        await guincho.destroy();
        return res.status(200).json({ message: 'Guincho removido com sucesso' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listaModelosGuincho = async (req, res) => {
    try {
        const modelos = await BaseGuinchos.findAll();
        return res.status(200).json(modelos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const selecionarGuinchoAtual = async (req, res) => {
    try {
        const { guinchoId } = req.params;
        const guincheiroId = req.userId; 

        await Guincho.update(
            { ativo: false },
            { where: { guincheiro_id: guincheiroId } }
        );

        await Guincho.update(
            { ativo: true },
            { where: { id: guinchoId, guincheiro_id: guincheiroId } }
        );

        return res.json({ message: "Guincho atual atualizado com sucesso!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao atualizar guincho atual." });
    }
};

