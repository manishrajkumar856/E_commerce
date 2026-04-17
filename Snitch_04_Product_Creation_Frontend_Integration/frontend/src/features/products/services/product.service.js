import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/products",
    withCredentials: true,
});

export const createProduct = async (formData) => {
    const response = await api.post("/", formData);
    return response.data;
};

export const getSellerProducts = async () => {
    const response = await api.get("/seller");
    return response.data;
};