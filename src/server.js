import 'dotenv/config';
import express from 'express'
import http from 'http';
import { Server } from 'socket.io';
import clienteRoutes from './routers/clientesRoutes.js';
import guincheiroRoutes from './routers/guincheirosRoutes.js';
import veiculoRoutes from './routers/veiculosRoutes.js';
import chamadosRoutes from './routers/chamadosRoutes.js';
import guinchosRoutes from './routers/guinchosRoutes.js';
import baseGuinchosRoutes from './routers/baseGuinchosRoutes.js';
import valoresGuinchoRoutes from './routers/valoresGuinchoRoutes.js';
import cors from 'cors';
import { setupSwagger } from '../swagger.js';
import Chamado from './models/Chamado.js';



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
app.use('/base-guinchos', baseGuinchosRoutes);
app.use('/valores-guincho', valoresGuinchoRoutes);


const confirmacoesPorChamado = new Map();

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('join-call-room', (callId) => {
        socket.join(`call-${callId}`);
        console.log(`Socket ${socket.id} entrou na sala do chamado ${callId}`);
    });

    socket.on('guincheiro-location', (data) => {
        const { callId, latitude, longitude } = data;
        console.log(`Localização do guincheiro recebida para chamado ${callId}:`, { latitude, longitude });
        
        io.to(`call-${callId}`).emit('guincheiro-location-update', {
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('cliente-location', (data) => {
        const { callId, latitude, longitude } = data;
        console.log(`Localização do cliente recebida para chamado ${callId}:`, { latitude, longitude });
        
        io.to(`call-${callId}`).emit('cliente-location-update', {
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('cliente-confirmou-chegada', (data) => {
        const { callId, tipo } = data;
        const key = `${callId}-${tipo}`;
        
        console.log(`[Socket] Cliente confirmou chegada no ${tipo} para chamado ${callId}`);
        
        if (!confirmacoesPorChamado.has(key)) {
            confirmacoesPorChamado.set(key, { cliente: false, guincheiro: false });
        }
        const estado = confirmacoesPorChamado.get(key);
        estado.cliente = true;
        
        io.to(`call-${callId}`).emit('cliente-confirmou-chegada', { tipo });
        
        if (estado.cliente && estado.guincheiro) {
            console.log(`[Socket] Ambos confirmaram chegada no ${tipo} para chamado ${callId}`);
            io.to(`call-${callId}`).emit('ambos-confirmaram', { tipo });
            
            if (tipo === 'final') {
                Chamado.findByPk(callId)
                    .then(chamado => {
                        if (chamado && chamado.status_chamado !== 'concluido') {
                            chamado.update({
                                status_chamado: 'concluido',
                                completado_em: new Date()
                            })
                            .then(() => {
                                console.log(`[Socket] Chamado ${callId} marcado como concluído automaticamente`);
                            })
                            .catch(err => {
                                console.error(`[Socket] Erro ao atualizar status do chamado ${callId}:`, err);
                            });
                        }
                    })
                    .catch(err => {
                        console.error(`[Socket] Erro ao buscar chamado ${callId}:`, err);
                    });
            }
            
            confirmacoesPorChamado.delete(key);
        }
    });

    socket.on('guincheiro-confirmou-chegada', (data) => {
        const { callId, tipo } = data;
        const key = `${callId}-${tipo}`;
        
        console.log(`[Socket] Guincheiro confirmou chegada no ${tipo} para chamado ${callId}`);
        
        if (!confirmacoesPorChamado.has(key)) {
            confirmacoesPorChamado.set(key, { cliente: false, guincheiro: false });
        }
        const estado = confirmacoesPorChamado.get(key);
        estado.guincheiro = true;
        
        io.to(`call-${callId}`).emit('guincheiro-confirmou-chegada', { tipo });
        
        if (estado.cliente && estado.guincheiro) {
            console.log(`[Socket] Ambos confirmaram chegada no ${tipo} para chamado ${callId}`);
            io.to(`call-${callId}`).emit('ambos-confirmaram', { tipo });
            
            if (tipo === 'final') {
                Chamado.findByPk(callId)
                    .then(chamado => {
                        if (chamado && chamado.status_chamado !== 'concluido') {
                            chamado.update({
                                status_chamado: 'concluido',
                                completado_em: new Date()
                            })
                            .then(() => {
                                console.log(`[Socket] Chamado ${callId} marcado como concluído automaticamente`);
                            })
                            .catch(err => {
                                console.error(`[Socket] Erro ao atualizar status do chamado ${callId}:`, err);
                            });
                        }
                    })
                    .catch(err => {
                        console.error(`[Socket] Erro ao buscar chamado ${callId}:`, err);
                    });
            }
            
            confirmacoesPorChamado.delete(key);
        }
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

export { io };