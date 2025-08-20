import Guincheiro from '../models/Guincheiro.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET = 'teste';

export const criarGuincheiro = async (req, res) => {
    try {
        const { nome, email, senha, cpf, telefone, cnh_num } = req.body;

        const emailExists = await Guincheiro.findOne({where: { email }});

        const cpfExists = await Guincheiro.findOne({where: { cpf }});

        if (emailExists) {
            res.status(409).json({error: "Email já cadastrado!"})
            return
        }

        if (cpfExists) {
            res.status(409).json({error: "CPF já cadastrado!"})
            return
        }

        const senhaHash = await bcrypt.hash(senha, 10);


        const novoGuincheiro = await Guincheiro.create({ nome, email, senha: senhaHash, cpf, telefone, cnh_num });
        const { senha:_, ...guincheiroSemSenha} = novoGuincheiro.dataValues;

        res.status(201).json(guincheiroSemSenha);
    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
};

export const buscaGuincheiro = async (req, res) => {
    try {
        const guincheiros = await Guincheiro.findAll({
            attributes: {exclude: ['senha']}
        }); 
        res.status(200).json(guincheiros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscaGuincheiroPorId = async (req, res) => {
    try {
        const guincheiro = await Guincheiro.findByPk(req.params.id, {
            attributes: {exclude: ['senha']}
        }); 

        if (!guincheiro) return res.status(404).json({ error: "Guincheiro não encontrado" });
        
        else res.status(200).json(guincheiro);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const atualizaGuincheiro = async (req, res) => {
    try {

        const guincheiro = await Guincheiro.findByPk(req.params.id);

        if (!guincheiro) return res.status(404).json({error: "Guincheiro não encontrado"})

        let senhaHash = guincheiro.senha;

        if (!senha) senhaHash = await bcrypt.hash(senha, 10);

        const { nome, email, senha, cpf, telefone, cnh_num } = req.body; 

        if (!guincheiro) return res.status(404).json({ error: "Guincheironão encontrado" });

        await guincheiro.update({ nome, email, senha: senhaHash, cpf, telefone, cnh_num });
            res.status(200).json(guincheiro);
        
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

        if (!email || !senha) {
            return res.status(400).json({error: "Preencha todos os campos!"})
        }

        if (!guincheiro || guincheiro.senha !== senha) {
            return res.status(404).json({error: "Credenciais inválidas!"})
        } 

        if (!guincheiro) return res.status(404).json({error: 'Credenciais Inválidas'})

        const token = JsonWebTokenError.sign({userId: guincheiro.id}, SecretKeyRequiredError, { expiresIn: '1h '})
        return res.json({
            auth: true,
            token,
            guincheiro: {
                id: guincheiro.id,
                nome: guincheiro.nome,
                email: guincheiro.email,
                telefone: guincheiro.telefone,
                cpf: guincheiro.cpf,
                chn_num: guincheiro.cnh_num,
                foto_url: guincheiro.foto_url
            }
        });

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
