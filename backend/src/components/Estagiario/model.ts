import mongoose, { Schema, Document } from 'mongoose';

interface IEstagiario extends Document {
    name: string;
    email: string;
    role?: string;
    company?: string;
    techStack: string[];
    bio?: string;
    birth?: Date;
    startDate: Date;
    endDate?: Date;
    story: string;
    social: {
        linkedin?: string;
        github?: string;
        instagram?: string;
    };
}

const EstagiarioSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: false },
    company: { type: String, required: false, default: 'Independente' },
    techStack: { type: [String], required: true },
    bio: { type: String, required: false },
    birth: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    story: { type: String },
    social: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },
});

export default mongoose.model<IEstagiario>('Estagiario', EstagiarioSchema);
