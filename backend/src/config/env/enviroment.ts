import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    PORT: string | number;
    MONGO_URI: {
        mongo_host: string;
        mongo_db: string;
    };
    FRONTEND_URL: string;
}

//desenvolvimento
const devEnviroment: IConfig = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: {
        mongo_host: 'mongodb://127.0.0.1:27017', //local
        mongo_db: 'portal',
    },
    FRONTEND_URL: 'http://localhost:4200',
};

//producao
const prodEnviroment: IConfig = {
    PORT: 8000,
    MONGO_URI: {
        mongo_host: 'mongodb://127.0.0.1:27017',
        mongo_db: 'portal',
    },
    FRONTEND_URL:
        process.env.FRONTEND_URL_PROD || 'https://localhost:4200/prod',
};
//teste
const testEnviroment: IConfig = {
    PORT: process.env.PORT || 4100,
    MONGO_URI: {
        mongo_host: 'mongodb://127.0.0.1:27017',
        mongo_db: 'test_db_portal',
    },
    FRONTEND_URL: 'http://localhost:4200',
};

const envConfig: { [name: string]: IConfig } = {
    development: devEnviroment,
    production: prodEnviroment,
    test: testEnviroment,
};
// exporta sendo o ambiente de dev o padrão
export default envConfig[process.env.NODE_ENV || 'development'];
