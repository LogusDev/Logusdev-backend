import ValoresGuincho from '../models/ValoresGuincho.js';

export const criarValoresGuincho = async (req, res) => {
    try {
        const { idGuincheiro, valorSaida, valorKm } = req.body;
        
        const dataRegistro = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
        
        const novoValor = await ValoresGuincho.create({
            idGuincheiro,
            valorSaida,
            valorKm,
            dataRegistro
        });
        
        return res.status(201).json(novoValor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const buscarValoresPorGuincheiro = async (req, res) => {
    try {
        const { idGuincheiro } = req.params;
        const valores = await ValoresGuincho.findAll({
            where: { idGuincheiro },
            order: [['dataRegistro', 'DESC']]
        });
        return res.status(200).json(valores);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const buscarValorAtualPorGuincheiro = async (req, res) => {
    try {
        const { idGuincheiro } = req.params;
        const valorAtual = await ValoresGuincho.findOne({
            where: { idGuincheiro },
            order: [['dataRegistro', 'DESC']]
        });
        
        if (!valorAtual) {
            return res.status(404).json({ error: 'Valores não encontrados para este guincheiro' });
        }
        
        return res.status(200).json(valorAtual);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const atualizarValoresGuincho = async (req, res) => {
    try {
        const { id } = req.params;
        const { valorSaida, valorKm } = req.body;
        
        const valor = await ValoresGuincho.findByPk(id);
        if (!valor) {
            return res.status(404).json({ error: 'Valor não encontrado' });
        }
        
        await valor.update({ valorSaida, valorKm });
        return res.status(200).json(valor);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};





