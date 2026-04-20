import { useDispatch } from "react-redux"
import { createProduct, getAllProducts, getProductById, getSellerProducts } from "../services/product.service";
import { setProducts, setSellerProducts } from "../state/product.slice";
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


    async function handleGetAllProducts() {
        try {
            const data = await getAllProducts();
            if (data && data.products) {
                dispatch(setProducts(data.products));
                console.log("Fetched Products:", data.products);
                return data.products;
            }
        } catch (error) {
            console.error("Failed to load all products:", error);
        }
        return [];
    }

    async function handleGetProductById(id) {
        console.log("ID:", id);
        try {
            const data = await getProductById(id);
            if (data) {
                return data.product || data;
            }
        } catch (error) {
            console.error("Failed to load product details:", error);
        }
        return null;
    }

    return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById };
}