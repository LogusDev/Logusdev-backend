import express from 'express'
import clienteRoutes from './routers/clientesRoutes.js';
import guincheiroRoutes from './routers/guincheirosRoutes.js';
import veiculoRoutes from './routers/veiculosRoutes.js';
import chamadosRoutes from './routers/chamadosRoutes.js';
import cors from 'cors';
import { setupSwagger } from '../swagger.js';
import http from 'http';
import { Server } from 'socket.io'



const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Novo cliente conectado: ", socket.id);

    socket.on("new_ticket", (dadosChamado) => {
        console.log("Chamado recebido: ", dadosChamado);

        io.emit("ticket_update", dadosChamado);
    });

    socket.on("ticket_paid", (dadosChamado) => {
        console.log("Pagamento concluído: ", dadosChamado);
        io.emit("ticket_update", dadosChamado)
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado: ", socket.id)
    });
});

const PORT = 3333;

setupSwagger(app);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
    res.send("Os gurih estão no ar! 🚀")
})

app.use(express.json())
app.use('/clientes', clienteRoutes);
app.use('/guincheiros', guincheiroRoutes)
app.use('/veiculos', veiculoRoutes)
app.use('/chamados', chamadosRoutes);

server.listen(PORT, (error) => {
    if (error) {
        console.log("Algo deu errado");
        return
    }

    console.log(`Tá rodando, na porta ${PORT}`)
})

