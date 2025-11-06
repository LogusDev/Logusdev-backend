import Guincho from '../models/Guincho.js'; 
import axios from 'axios';

export const buscaGuincho = async (req, res) => {
    try {
        const guinchos = await Guincho.findAll();
        return res.status(200).json(guinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const buscaGuinchoPorId = async (req, res) => {
    try {
        const guincho = await Guincho.findByPk(req.params.id);
        if (!guincho) return res.status(404).json({ error: 'Guincho não encontrado' });
        return res.status(200).json(guincho);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const buscaGuinchosPorGuincheiro = async (req, res) => {
    try {
        const guincheiroId = Number(req.params.id) || req.params.id;
        const guinchos = await Guincho.findAll({ where: { guincheiro_id: guincheiroId } });
        return res.status(200).json(guinchos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const adicionarGuincho = async (req, res) => {
    try {
        const { placa, marca, modelo, ano_fabricacao, capacidade, comprimento_plataforma, cor } = req.body;
        const guincheiro_id = req.guincheiroId;
        const novoGuincho = await Guincho.create({
            placa, marca, cor, modelo, ano_fabricacao, capacidade, comprimento_plataforma, guincheiro_id
        });
        return res.status(201).json(novoGuincho);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};