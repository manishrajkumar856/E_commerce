import { useDispatch } from "react-redux";
import { createProduct, getAllProducts, getProductById, getSellerProducts, addVariant } from "../services/product.service";
import { setProducts, setSellerProducts } from "../state/product.slice";
import { toast } from "react-toastify";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        try {
            const data = await createProduct(formData);
            toast.success("Product published successfully!");
            return data.products;
        } catch (error) {
            console.error("Failed to create product:", error);
            toast.error(error?.response?.data?.message || "Failed to publish product");
            throw error;
        }
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
            toast.success("Variant added successfully!");
            return data;
        } catch (error) {
            console.error("Failed to add variant:", error);
            toast.error(error?.response?.data?.message || "Failed to add variant");
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