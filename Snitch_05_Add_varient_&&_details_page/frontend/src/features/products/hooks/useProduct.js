import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getProductById, getSellerProducts, addVariant } from "../services/product.service";
import { setProducts, setSellerProducts } from "../state/product.slice";

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
                return data.products;
            }
        } catch (error) {
            console.error("Failed to load all products:", error);
        }
        return [];
    }

    async function handleGetProductById(id) {
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

    async function handleAddVariant(id, variantData) {
        try {
            const data = await addVariant(id, variantData);
            return data;
        } catch (error) {
            console.error("Failed to add variant:", error);
            throw error;
        }
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleAddVariant,
    };
};