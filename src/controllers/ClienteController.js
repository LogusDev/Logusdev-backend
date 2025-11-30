import Cliente from '../models/Cliente.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import dotenv from "dotenv";    

dotenv.config();

const SECRET = "teste"
                            

export const criarCliente = async (req, res) => {
    try {

        const { nome, email, senha, cpf, telefone, cnh_num, foto_url } = req.body;

        const emailExists = await Cliente.findOne({where: { email }});
        const cpfExists = await Cliente.findOne({where: {cpf}});

        if (emailExists) {
            res.status(409).json({error: "Email já cadastrado!"})
            return
        }

        if (cpfExists) {
            res.status(409).json({error: "CPF já cadastrado!"})
            return
        }


        const senhaHash = await bcrypt.hash(senha, 10);
        const novoCliente = await Cliente.create({ nome, email, senha:senhaHash, cpf, telefone, cnh_num,foto_url });
        const { senha:_, ...clienteSemSenha} = novoCliente.dataValues; 
        res.status(201).json(clienteSemSenha);

    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
};

export const buscaCliente = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            attributes: {exclude: ['senha']}
        });
        
        console.log(`${req.user?.nome || "User desconhecido"} fez essa busca de clientes` )
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscaClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, {
            attributes: {exclude: ['senha']}
        }); 
        

        if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

        else res.status(200).json(cliente);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const atualizaCliente = async (req, res) => {
    try {

        const { nome, email, senha, cpf, telefone, cnh_num } = req.body;
        const cliente = await Cliente.findByPk(req.params.id); 
        
        if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

        let senhaHash = cliente.senha;
        if (senha) { senhaHash = await bcrypt.hash(senha, 10)}

        await cliente.update({ nome, email, senha: senhaHash, cpf, telefone, cnh_num });
        res.status(200).json(cliente);

        

       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deletaCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) res.status(404).json({ error: "Cliente não encontrado!" }); 

        else {
            await cliente.destroy();
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginCliente = async (req, res) => {
    try {

        const { email, senha } = req.body;
        
        const cliente = await Cliente.findOne({where: { email }});

        if (!email || !senha) return res.status(400).json({error: "Preencha todos os campos!"})
        
        if(!cliente){
            return res.status(404).json({error:'Credenciais Invalidas!'})
        }

        const comparaSenha = await bcrypt.compare(senha, cliente.senha);
        if(!comparaSenha){
            return res.status(401).json({error:"Credenciais Invalidas"})
        }


        const token = jwt.sign({userId: cliente.id}, SECRET, { expiresIn: '1d' } )
        return res.json({
            auth: true,
            token,
            cliente: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                cpf: cliente.cpf,
                cnh_num: cliente.cnh_num,
                foto_url: cliente.foto_url,
                created_at: cliente.created_at
            }
        });

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const trocarSenha = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const cliente = await Cliente.findByPk(id);

        if (!cliente) return res.status(404).json({error: "Cliente não encontrado"})

        const bateSenha = await bcrypt.compare(currentPassword, cliente.senha);
        if (!bateSenha) return res.status(401).json({ error: "Senha atual incorreta." });

       const hash= await bcrypt.hash(newPassword, 10);
       cliente.senha = hash;
       await cliente.save();

       res.json({ message: "Senha alterada com sucesso!" });

    } catch (error) {
        res.status(500).json({error: "Erro ao alterar senha."});
    }
};
