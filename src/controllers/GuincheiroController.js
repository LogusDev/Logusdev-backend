import Guincheiro from '../models/Guincheiro.js';

export const criarGuincheiro = async (req, res) => {
    try {
        const { nome, email, senha, cpf, telefone, cnh_num } = req.body;
        const novoGuincheiro = await Guincheiro.create({ nome, email, senha, cpf, telefone, cnh_num });
        res.status(201).json(novoGuincheiro);
    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
};

export const buscaGuincheiro = async (req, res) => {
    try {
        const guincheiros = await Guincheiro.findAll(); 
        res.status(200).json(guincheiros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscaGuincheiroPorId = async (req, res) => {
    try {
        const guincheiro = await Guincheiro.findByPk(req.params.id); 
        if (!Guincheiro) {
            return res.status(404).json({ error: "Guincheiro não encontrado" });
        } else {
            res.status(200).json(guincheiro);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const atualizaGuincheiro = async (req, res) => {
    try {
        const { nome, email, senha, cpf, telefone, cnh_num } = req.body;
        const guincheiro = await Guincheiro.findByPk(req.params.id); 
        if (!Guincheiro) {
            return res.status(404).json({ error: "Guincheiro não encontrado" });
        } else {
            await Guincheiro.update({ nome, email, senha, cpf, telefone, cnh_num });
            res.status(200).json(Guincheiro);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deletaGuincheiro = async (req, res) => {
    try {
        const guincheiro = await Guincheiro.findByPk(req.params.id);
        if (!guincheiro) {
            res.status(404).json({ error: "Guincheiro não encontrado!" });
        } else {
            await guincheiro.destroy();
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginGuincheiro = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const guincheiro = await Guincheiro.findOne({where: { email }});

        console.log(email,senha)

        if (!email || !senha) {
            return res.status(400).json({error: "Preencha todos os campos!"})
        }

        if (!guincheiro || guincheiro.senha !== senha) {
            return res.status(404).json({error: "Credenciais inválidas!"})
        } 

        res.status(200).json({message: "Login realizado com sucesso!", guincheiro})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
