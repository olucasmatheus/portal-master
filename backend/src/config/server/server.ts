//@ts-ignore
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';
import express from 'express';
import cors from 'cors';
import connectToDatabase from '../connection/connection';
import * as dotenv from 'dotenv';
import envConfig from '../env/enviroment';
import userRoutes from '../../routes/UserRouter';
import estagiarioRoutes from '../../routes/EstagiarioRouter';

dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
    origin: envConfig.FRONTEND_URL,
};
app.use(cors(corsOptions));
app.use('/users', userRoutes);
app.use('/interns', estagiarioRoutes);
async function startServer() {
    try {
        await connectToDatabase();

        //prettier-ignore
        if (process.env.NODE_ENV === 'development') {
            app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
            );
        }
        //prettier-ignore
        app.listen(envConfig.PORT || process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${envConfig.PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

startServer();
