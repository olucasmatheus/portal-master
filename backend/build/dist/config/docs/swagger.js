"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outputFile = './swagger.json';
const endpointsFiles = ['./src/routes/index.ts'];
const doc = {
    info: {
        title: 'Portal Ilha Conectada',
        version: '1.0.0',
        description: process.env.NODE_ENV === 'development'
            ? 'API do Portal Ilha Conectada. Atualmente está rodando em desenvolvimento'
            : 'API do Portal Ilha Conectada. Atualmente está rodando em produção',
    },
    host: process.env.NODE_ENV === 'development'
        ? 'localhost:3000'
        : 'localhost:8000',
    definitions: {
        createUser: {
            $name: 'João',
            $password: 'minhasenha123@',
            $email: 'joaosilva@gmail.com',
            $profile: 'user',
        },
        login: {
            $email: 'joaosilva@gmail.com',
            $password: 'minhasenha123@',
        },
        createEstagiario: {
            $name: 'João',
            $email: 'joaosilva@gmail.com',
            company: 'ABC Tech',
            $techStack: ['JS', 'Python'],
            $bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            $birth: '2004-01-17',
            $startDate: '2023-04-24',
            $endDate: '2025-04-24',
            $social: {
                linkedin: 'https://www.linkedin.com/in/joaosilva',
                github: 'https://github.com/joaosilva',
            },
        },
    },
};
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger docs gerado com sucesso!');
    Promise.resolve().then(() => __importStar(require('../server/server')));
});
