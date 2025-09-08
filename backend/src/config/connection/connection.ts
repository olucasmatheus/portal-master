import mongoose from 'mongoose';
import dotenv from 'dotenv';
import envConfig from '../env/enviroment';

dotenv.config();

const mongoUri = `${envConfig.MONGO_URI.mongo_host}/${envConfig.MONGO_URI.mongo_db}`;

export default async function connectDB() {
    try {
        await mongoose.connect(mongoUri, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 20000,
        });

        console.log('conexão estabelecida!');
    } catch (error) {
        console.error('erro ao conectar o mongodb:', error);
        process.exit(1);
    }
}
