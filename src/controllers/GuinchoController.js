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
        console.log('🚗 [adicionarGuincho] Body recebido:', req.body);
        const { placa, marca, modelo, ano_fabricacao, capacidade, comprimento_plataforma, cor, guincheiro_id } = req.body;
        
        // Aceita guincheiro_id do body ou do req (para compatibilidade)
        const guincheiroId = guincheiro_id || req.guincheiroId;
        
        console.log('🆔 [adicionarGuincho] ID do guincheiro a ser usado:', guincheiroId);
        
        if (!guincheiroId) {
            console.error('❌ [adicionarGuincho] Erro: guincheiro_id não fornecido');
            return res.status(400).json({ error: 'guincheiro_id é obrigatório' });
        }
        
        const novoGuincho = await Guincho.create({
            placa, 
            marca, 
            cor, 
            modelo, 
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