import axios from "axios";

const api = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
});

export const createProduct = async (formData) => {
    const response = await api.post("/", formData);
    return response.data;
};

export const getSellerProducts = async () => {
    try {
        const response = await api.get("/seller");
        return response.data;
    } catch (error) {
        console.error("Error fetching seller products:", error);
        throw error;
    }
};

export const getAllProducts = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by id:", error);
        throw error;
    }
};

export const addVariant = async (id, variantData) => {
    const response = await api.post(`/${id}/variants`, variantData);
    return response.data;
};