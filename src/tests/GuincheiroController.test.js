import request from 'supertest';
import app from '../app.js';
import sequelize from '../database/sequelize.js';
import Guincheiro from '../models/Guincheiro.js';

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /guincheiros", () => {
  it("Deve criar um guincheiro com sucesso", async () => {
    const newGuincheiro = {
      nome: "Matheus Big Driver",
      email: "matheusbig@gmail.com",
      cpf: "29475860291",
      senha: "bigsenha123",
      telefone: "11936478392",
      cnh_num: "29475628105"
    };

    const res = await request(app).post("/guincheiros").send(newGuincheiro);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("matheusbig@gmail.com");
    expect(res.body).not.toHaveProperty("senha");
  });

  it("Deve retornar erro 409 se o email já existir", async () => {
    await Guincheiro.create({
      nome: "Matheus",
      email: "matheusbig@gmail.com",
      cpf: "11111111111",
      senha: "senha123",
      telefone: "11911111111",
      cnh_num: "11122233344"
    });

    const res = await request(app).post("/guincheiros").send({
      nome: "Clone",
      email: "matheusbig@gmail.com",
      cpf: "22222222222",
      senha: "senha456",
      telefone: "11922222222",
      cnh_num: "11122233355"
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "Email já cadastrado!");
  });

  it("Deve retornar erro 409 se o CPF já existir", async () => {
    await Guincheiro.create({
      nome: "Matheus",
      email: "matheus1@gmail.com",
      cpf: "29475860291",
      senha: "senha123",
      telefone: "11911111111",
      cnh_num: "11122233344"
    });

    const res = await request(app).post("/guincheiros").send({
      nome: "Clone",
      email: "matheus2@gmail.com",
      cpf: "29475860291",
      senha: "senha456",
      telefone: "11922222222",
      cnh_num: "11122233355"
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "CPF já cadastrado!");
  });
});

describe("GET /guincheiros", () => {
  it("Deve buscar todos os guincheiros", async () => {
    await Guincheiro.create({
      nome: "Guincheiro 1",
      email: "g1@gmail.com",
      cpf: "11111111111",
      senha: "senha123",
      telefone: "11911111111",
      cnh_num: "11122233344"
    });

    await Guincheiro.create({
      nome: "Guincheiro 2",
      email: "g2@gmail.com",
      cpf: "22222222222",
      senha: "senha321",
      telefone: "11922222222",
      cnh_num: "11122233355"
    });

    const res = await request(app).get("/guincheiros");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
