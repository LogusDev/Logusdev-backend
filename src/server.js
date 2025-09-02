import express from 'express'
import clienteRoutes from './routers/clientesRoutes.js';
import guincheiroRoutes from './routers/guincheirosRoutes.js';
import veiculoRoutes from './routers/veiculosRoutes.js';
import chamadosRoutes from './routers/chamadosRoutes.js';
import cors from 'cors';
import { setupSwagger } from '../swagger.js';



const app = express();
const PORT = 3333;

setupSwagger(app);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use('/clientes', clienteRoutes);
app.use('/guincheiros', guincheiroRoutes)
app.use('/veiculos', veiculoRoutes)
app.use('/chamados', chamadosRoutes );

app.listen(PORT, (error) => {
    if (error) {
        console.log("Algo deu errado");
        return
    }

    console.log(`Tá rodando, na porta ${PORT}`)
})

