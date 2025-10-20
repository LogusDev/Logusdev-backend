import Veiculo from '../models/Veiculo.js';
import axios from 'axios';

export const adicionarVeiculo = async (req, res) => {
    try {
        const {placa, marca, modelo, ano_fabricacao, categoria} = req.body;
        const cliente_id = req.userId
        
        const responseModelos = await axios.get(
        `https://fipe.parallelum.com.br/api/v2/cars/brands/${marca}/models`
        );

        const modeloEncontrado = responseModelos.data.find(
        (m) => m.code == modelo
        );

        console.log('Nome do modelo:', modeloEncontrado.name);

        const responseMarcas = await axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/`
        );
        
        const marcaEncontrada = responseMarcas.data.find(
            (m) => m.code == marca
        );

        console.log('Nome da marca:', marcaEncontrada.name);

        const novoVeiculo = await Veiculo.create({
            placa, marca:marcaEncontrada.name,
            modelo:modeloEncontrado.name,
            ano_fabricacao,
            categoria,
            cliente_id});
            
        res.status(201).json(novoVeiculo);
        console.log(novoVeiculo.categoria);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
};

export const buscaVeiculo = async (req, res) => {
    try {
        const veiculos = await Veiculo.findAll({where: { cliente_id: req.userId }});
        res.status(200).json(veiculos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscaVeiculoPorIdPk = async (req, res) => {
    try {
        const veiculo = await Veiculo.findByPk(req.params.id);

        if (!veiculo) {
            return res.status(404).json({error: error.message})
        } else {
            res.status(200).json(veiculo);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const buscaVeiculoPorId = async (req, res) => {
    try {
        const veiculo = await Veiculo.findAll({ where: { cliente_id: req.userId } });
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        } else {
            res.status(200).json(veiculo);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletaVeiculo = async (req, res) => {
    try {
        const veiculo = await Veiculo.findByPk(req.params.id);
        if (!veiculo) {
            res.status(400).json({ error: error.message })
        } else {
            await Veiculo.destroy({where: { id: req.params.id}});
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}