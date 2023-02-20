import { model, Schema } from 'mongoose';

export interface ShopInterface {
    _id?: string;
    name: string;
}

const shopSchema = new Schema<ShopInterface>({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

export const Shop = model<ShopInterface>('Shop', shopSchema);
