import { useDispatch } from "react-redux"
import { createProduct, getSellerProducts } from "../services/product.service";
import { setSellerProducts } from "../state/product.slice";
import { CloudCog } from "lucide-react";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.products;
    }

    async function handleGetSellerProduct() {
        try {
            const data = await getSellerProducts();
            if (data && data.products) {
                dispatch(setSellerProducts(data.products));
                console.log("Fetched Products:", data.products);
                return data.products;
            }
        } catch (error) {
            console.error("Failed to load seller products:", error);
        }
        return [];
    }

    return { handleCreateProduct, handleGetSellerProduct };
}