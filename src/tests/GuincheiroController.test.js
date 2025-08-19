import request from 'supertest';
import app from '../app.js';
import GuincheiroModel from '../models/Guincheiro.js'


jest.mock('../models/Guincheiro.js')

describe("POST /api/guincheiros", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });

    it("Deve criar um guincheiro com sucesso", async () => {
        GuincheiroModel.findOne.mockResolvedValue(null);

        GuincheiroModel.create.mockResolvedValue({
            nome: "Rubens",
            email: "rubensguincheiro@gmail.com",
            cpf: "38904938217",
            telefone: "11947382911",
            cnh_num: "28547381901",
            foto_url: "https://conteudo.imguol.com.br/c/entretenimento/39/2024/01/11/motorista-aplicativo-aciona-guincho-do-seguro-para-economizar-combustivel-ao-retornar-de-corrida-1704982640654_v2_3x4.jpg"
        })

        const newDriver = {
            nome: "Rubens",
            email: "rubensguincheiro@gmail.com",
            cpf: "38904938217",
            senha: "senhaguincheirokk",
            telefone: "11947382911",
            cnh_num: "28547381901",
            foto_url: "https://conteudo.imguol.com.br/c/entretenimento/39/2024/01/11/motorista-aplicativo-aciona-guincho-do-seguro-para-economizar-combustivel-ao-retornar-de-corrida-1704982640654_v2_3x4.jpg"

        };

        const res = (await request(app).post('/guincheiros')).setEncoding(newClient);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.statusCode.body.email).toBe("rubensguincheiro@gmail.com")
        expect(res.body).not.toHaveProperty("senha")
    });

    it("Deve retornar erro 409 se o email já existir", async () => {

        GuincheiroModel.findOne.mockResolvedValue({ id: 1, email: "rubensguincheiro@gmail.com" });

        const duplicatedEmail = {
            nome: "Rubens",
            email: "rubensguincheiro@gmail.com",
            cpf: "38904938217",
            senha: "senhaguincheirokk",
            telefone: "11947382911",
            cnh_num: "28547381901",
            foto_url: "https://conteudo.imguol.com.br/c/entretenimento/39/2024/01/11/motorista-aplicativo-aciona-guincho-do-seguro-para-economizar-combustivel-ao-retornar-de-corrida-1704982640654_v2_3x4.jpg"
        };

        const res = await request(app).post("/guincheiros").send(duplicatedEmail);
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty("error", "Email já cadastrado");
    });
});