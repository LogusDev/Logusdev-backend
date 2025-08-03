import request from 'supertest';
import app from '../app.js';
import sequelize from '../database/sequelize.js';
import ClientModel from '../models/Cliente.js'



beforeEach(async () => {
    await sequelize.sync({ force:true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("POST /api/clientes", () => {
    it("Deve criar um cliente com sucesso", async () => {
        const newClient = {
            nome: "Murilo",
            email: "murilinhoteste@gmail.com",
            cpf: "19570215782",
            senha: "senhateste123",
            telefone: "11927486038",
            cnh_num: "28495042135",
            foto_url: "https://uk.pinterest.com/pin/lebron-james-watching-everybody-resign-and-get-paid-like-atrain--144326363043208546/"
        };

        const res = await request(app).post("/clientes").send(newClient);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.email).toBe("murilinhoteste@gmail.com");
        expect(res.body).not.toHaveProperty("senha");
    });

    it("Deve retornar erro 409 se o email já existir", async () => {

        await request(app).post("/clientes").send({
            nome: "Murilo",
            email: "murilinhoteste@gmail.com",
            cpf: "19570215782",
            senha: "senhateste123",
            telefone: "11927486038",
            cnh_num: "28495042135",
            foto_url: "https://uk.pinterest.com/pin/lebron-james-watching-everybody-resign-and-get-paid-like-atrain--144326363043208546/"
        })

        const duplicatedEmail = {
            nome: "Murilo2",
            email: "murilinhoteste@gmail.com",
            cpf: "19570215783",
            senha: "senhateste1234",
            telefone: "11927486039",
            cnh_num: "28495042136",
            foto_url: "https://content.imageresizer.com/images/memes/lebron-james-crying-meme-2.jpg",
        };

        const res = await request(app).post("/clientes").send(duplicatedEmail);
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty("error", "Email já cadastrado!");
    });
});