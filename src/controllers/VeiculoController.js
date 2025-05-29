import Veiculo from '../models/Veiculo.js';
import axios from 'axios';

export const adicionarVeiculo = async (req, res) => {
    try {
        const {placa, marca, modelo, ano_fabricacao,cliente_id,categoria} = req.body;
        
        const responseModelos = await axios.get(
        `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/`
        );

        const modeloEncontrado = responseModelos.data.modelos.find(
        (m) => m.codigo == modelo
        );

        console.log('Nome do modelo:', modeloEncontrado.nome);

        const responseMarcas = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/`
        );
        
        const marcaEncontrada = responseMarcas.data.find(
            (m) => m.codigo == marca
        );

        console.log('Nome da marca:', marcaEncontrada.nome);


        const novoVeiculo = await Veiculo.create({placa, marca:marcaEncontrada.nome, modelo:modeloEncontrado.nome, ano_fabricacao,categoria,cliente_id});
        res.status(201).json(novoVeiculo);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
};

export const buscaVeiculo = async (req, res) => {
    try {
        const veiculos = await Veiculo.findAll();
        res.status(200).json(veiculos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscaVeiculoPorId = async (req, res) => {
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

export const deletaVeiculo = async (req, res) => {
    try {
        const veiculo = await Veiculo.findByPk(req.params.id);
        if (!veiculo) {
            res.status(400).json({ error: error.message })
        } else {
            await Veiculo.destroy();
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}