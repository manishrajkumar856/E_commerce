import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    }, 
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
            default: 'INR',
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            }
        }
    ]
}, 
{
    timestamps: true,
});

const productModel = mongoose.model('Products', productSchema);
export default productModel;