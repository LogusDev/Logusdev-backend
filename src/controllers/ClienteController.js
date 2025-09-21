import Cliente from '../models/Cliente.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import dotenv from "dotenv";    
import generateNewPassword from '../utils/mailer.js';
import nodemailer from 'nodemailer';
import fs from 'fs'
import path from 'path';

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


        const token = jwt.sign({userId: cliente.id}, SECRET, { expiresIn: '1h' } )
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
                foto_url: cliente.foto_url
            }
        });

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const resetSenhaCliente = async (req, res) => {
    try {
        const {email} = req.body;
        const cliente =await Cliente.findOne({where: {email}});

        if (!cliente) {
            return res.status(400).json({erro: "Email inválido"});
        }

        const newPassword = generateNewPassword();
        const hashPassword = await bcrypt.hash(newPassword, 10);

        await Cliente.update({senha: hashPassword}, {where: {email}});

        const filePath = path.resolve("src/content/resetSenha.html");
        let htmlBody = fs.readFileSync(filePath, "utf8");
        htmlBody = htmlBody.replace("{{SENHA}}", newPassword);
        console.log(htmlBody)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"App GuinchAqui" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Redefinição de Senha",
            text: `Sua nova senha é: ${newPassword}`,
            html: htmlBody
        });

        res.status(200).json({
            mensagem: "Nova Senha enviada com sucesso!"
        })

    } catch (error) {
        res.status(400).json({
            erro: "Erro ao redefinir senha",
            detalhe: error.message
        });
    }
};
