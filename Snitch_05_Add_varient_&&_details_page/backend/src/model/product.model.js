import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
        ref: 'User',
        required: true,
    }, 
    variants: {
        type: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true,
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0,
            },
            attributes: {
                type: Map,
                of: String,
            },
            price: {
                currency: {
                    type: String,
                    enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
                    default: 'INR'
                },
                amount: {
                    type: Number,
                    required: true,
                }
            }
        }
    ],
    required: true,
    }
}, 
{
    timestamps: true,
});

const productModel = mongoose.model('Product', productSchema);
export default productModel;