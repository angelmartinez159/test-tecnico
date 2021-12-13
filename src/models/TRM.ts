import mongoose from 'mongoose';
import { TRM } from '../types/TRM';
const { Schema } = mongoose;

const trmModel = new Schema<TRM>({
    source: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
});

export default mongoose.model<TRM>('TRM', trmModel);
