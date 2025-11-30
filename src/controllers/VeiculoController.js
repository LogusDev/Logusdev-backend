import Veiculo from '../models/Veiculo.js';
import axios from 'axios';

export const adicionarVeiculo = async (req, res) => {
    try {
        const {placa, marca, modelo, ano_fabricacao, categoria, cor, cliente_id: cliente_id_body} = req.body;
        const cliente_id = req.userId || cliente_id_body;
        
        if (!cliente_id) {
            return res.status(400).json({ error: "cliente_id é obrigatório" });
        }
        
        const responseModelos = await axios.get(
        `https://fipe.parallelum.com.br/api/v2/cars/brands/${marca}/models`
        );

        let modeloEncontrado = responseModelos.data.find(
        (m) => m.code == modelo
        );
        
        if (!modeloEncontrado) {
            modeloEncontrado = responseModelos.data.find(
                (m) => m.name.toLowerCase() === modelo.toLowerCase()
            );
        }

        const nomeModelo = modeloEncontrado ? modeloEncontrado.name : modelo;

        const responseMarcas = await axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/`
        );
        
        const marcaEncontrada = responseMarcas.data.find(
            (m) => m.code == marca
        );

        const nomeMarca = marcaEncontrada ? marcaEncontrada.name : marca;

        console.log('Nome do modelo:', nomeModelo);
        console.log('Nome da marca:', nomeMarca);

        const novoVeiculo = await Veiculo.create({
            placa, 
            marca: nomeMarca,
            cor,
            modelo: nomeModelo,
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
        const clienteId = req.params.id;
        const veiculo = await Veiculo.findAll({ where: { cliente_id: clienteId } });
        if (!veiculo) {
            return res.status(404).json({ error: "Veículo não encontrado" });
        } else {
            res.status(200).json(veiculo);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const atualizaVeiculo = async (req, res) => {
    try {
        const { placa, marca, modelo, ano_fabricacao, categoria, cor} = req.body;
        const { id } = req.params;

        const veiculo = await Veiculo.findByPk(id);

        if (!veiculo) return res.status(404).json({error: "Veículo não encontrado"});

        veiculo.placa = placa || veiculo.placa;
        veiculo.cor = cor || veiculo.cor;
        veiculo.marca = marca || veiculo.marca;
        veiculo.modelo = modelo || veiculo.modelo;
        veiculo.ano_fabricacao = ano_fabricacao || veiculo.ano_fabricacao;
        veiculo.categoria = categoria || veiculo.categoria;

        await veiculo.save();

        res.status(200).json(veiculo);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

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

export const selecionarVeiculoAtual = async (req, res) => {
    try {
        const { veiculoId } = req.params;
        const { cliente_id } = req.body;

        await Veiculo.update(
            { ativo: 0 },
            { where: { cliente_id } }
        )

        await Veiculo.update(
            { ativo: 1 },
            { where: { id: veiculoId, cliente_id } }
        );

        res.json({ message: "Veiculo atual atualizado com sucesso!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar veiculo atual." })
    }
};