"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const enviroment_1 = __importDefault(require("../env/enviroment"));
dotenv_1.default.config();
const mongoUri = `${enviroment_1.default.MONGO_URI.mongo_host}/${enviroment_1.default.MONGO_URI.mongo_db}`;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoUri, {
                connectTimeoutMS: 10000,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 20000,
            });
            console.log('conexão estabelecida!');
        }
        catch (error) {
            console.error('erro ao conectar o mongodb:', error);
            process.exit(1);
        }
    });
}
