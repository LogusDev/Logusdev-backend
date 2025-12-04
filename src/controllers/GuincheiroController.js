import Guincheiro from '../models/Guincheiro.js';
import jwt from "jsonwebtoken";

const SECRET = "teste"

export const criarGuincheiro = async (req, res) => {
    try {
        const { nome, email, senha, cpf, telefone, cnh_num, foto_url, cnh_url } = req.body;
        const novoGuincheiro = await Guincheiro.create({ 
            nome, 
            email, 
            senha, 
            cpf, 
            telefone, 
            cnh_num,
            foto_url,
        });
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
        const { id } = req.params;
        const guincheiro = await Guincheiro.findByPk(id);

        if (!guincheiro) {
            return res.status(404).json({ error: "Guincheiro não encontrado" });
        }
        await Guincheiro.update(
            { nome, email, senha, cpf, telefone, cnh_num },
            { where: { id } }
        );
        const atualizado = await Guincheiro.findByPk(id);

        res.status(200).json(atualizado);

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

        if (!email || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos!" });
        }

        const guincheiro = await Guincheiro.findOne({ where: { email } });

        if (!guincheiro) {
            return res.status(404).json({ error: "Credenciais inválidas!" });
        }

        const token = jwt.sign(
            { userId: guincheiro.id, tipo: "guincheiro" },
            SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            auth: true,
            token,
            guincheiro: {
                id: guincheiro.id,
                nome: guincheiro.nome,
                email: guincheiro.email,
                telefone: guincheiro.telefone,
                foto_url: guincheiro.foto_url
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const trocarSenhaGuincheiro = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const guincheiro = await Guincheiro.findByPk(id);
    if (!guincheiro)
      return res.status(404).json({ error: "Guincheiro não encontrado" });

    const bateSenha = await bcrypt.compare(currentPassword, guincheiro.senha);
    if (!bateSenha)
      return res.status(401).json({ error: "Senha atual incorreta." });

    const hash = await bcrypt.hash(newPassword, 10);
    guincheiro.senha = hash;
    await guincheiro.save();

    res.json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao alterar senha." });
  }
};

