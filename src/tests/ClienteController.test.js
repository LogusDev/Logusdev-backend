import request from 'supertest';
import app from '../app.js';
import sequelize from '../database/sequelize.js';
import Cliente from '../models/Cliente.js';


beforeEach(async () => {
  await sequelize.sync({ force: true });
});


afterAll(async () => {
  await sequelize.close();
});

describe("POST /clientes", () => {
  it("Deve criar um cliente com sucesso", async () => {
    const newClient = {
      nome: "Murilo",
      email: "murilinhoteste@gmail.com",
      cpf: "19570215782",
      senha: "senhateste123",
      telefone: "11927486038",
      cnh_num: "28495042135",
      foto_url: "https://meusite.com/foto.png"
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
      foto_url: "https://meusite.com/foto.png"
    });


    const duplicatedEmail = {
      nome: "Outro",
      email: "murilinhoteste@gmail.com",
      cpf: "19570215783",
      senha: "senhateste456",
      telefone: "11999999999",
      cnh_num: "12345678900",
      foto_url: "https://meusite.com/foto2.png"
    };

    const res = await request(app).post("/clientes").send(duplicatedEmail);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "Email já cadastrado!");
  });

  it("Deve retornar erro 409 se o CPF já existir", async () => {

    await request(app).post("/clientes").send({
      nome: "Murilo",
      email: "murilo1@gmail.com",
      cpf: "19570215782",
      senha: "senhateste123",
      telefone: "11927486038",
      cnh_num: "28495042135",
      foto_url: "https://meusite.com/foto.png"
    });


    const duplicatedCpf = {
      nome: "Outro",
      email: "murilo2@gmail.com",
      cpf: "19570215782",
      senha: "senhateste456",
      telefone: "11999999999",
      cnh_num: "12345678900",
      foto_url: "https://meusite.com/foto2.png"
    };

    const res = await request(app).post("/clientes").send(duplicatedCpf);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "CPF já cadastrado!");
  });
});
