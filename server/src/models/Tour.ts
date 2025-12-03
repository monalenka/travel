import mongoose, { Schema, Document } from 'mongoose';

export interface ITour extends Document {
    title: string;
    description: string;
    price: number;
    duration: number;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TourSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model<ITour>('Tour', TourSchema);