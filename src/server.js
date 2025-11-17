import 'dotenv/config';
import express from 'express'
import http from 'http';
import { Server } from 'socket.io';
import clienteRoutes from './routers/clientesRoutes.js';
import guincheiroRoutes from './routers/guincheirosRoutes.js';
import veiculoRoutes from './routers/veiculosRoutes.js';
import chamadosRoutes from './routers/chamadosRoutes.js';
import guinchosRoutes from './routers/guinchosRoutes.js';
import cors from 'cors';
import { setupSwagger } from '../swagger.js';



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = 3333;

setupSwagger(app);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use('/clientes', clienteRoutes);
app.use('/guincheiros', guincheiroRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/chamados', chamadosRoutes );
app.use('/guinchos', guinchosRoutes);

// Socket.IO - Gerenciamento de localização em tempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Cliente ou Guincheiro entra na sala do chamado
    socket.on('join-call-room', (callId) => {
        socket.join(`call-${callId}`);
        console.log(`Socket ${socket.id} entrou na sala do chamado ${callId}`);
    });

    // Guincheiro envia sua localização
    socket.on('guincheiro-location', (data) => {
        const { callId, latitude, longitude } = data;
        console.log(`Localização do guincheiro recebida para chamado ${callId}:`, { latitude, longitude });
        
        // Envia a localização para todos na sala do chamado (incluindo o cliente)
        io.to(`call-${callId}`).emit('guincheiro-location-update', {
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        });
    });

    // Cliente envia sua localização (opcional, caso precise)
    socket.on('cliente-location', (data) => {
        const { callId, latitude, longitude } = data;
        console.log(`Localização do cliente recebida para chamado ${callId}:`, { latitude, longitude });
        
        // Envia a localização para todos na sala do chamado (incluindo o guincheiro)
        io.to(`call-${callId}`).emit('cliente-location-update', {
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

server.listen(PORT, (error) => {
    if (error) {
        console.log("Algo deu errado");
        return
    }

    console.log(`Tá rodando, na porta ${PORT}`)
    console.log(`Socket.IO configurado e pronto para receber conexões`)
})

// Exportar io para uso em outros arquivos se necessário
export { io };

