import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: '/api/cart',
    withCredentials: true,
});

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    try {
        const response = await cartApiInstance.post(`/add/${productId}/${variantId}/`, { quantity });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getCart = async () => {
    try {
        const response = await cartApiInstance.get(`/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const removeFromCart = async ({ productId, variantId }) => {
    try {
        const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const incrementQuantity = async ({ productId, variantId }) => {
    try {
        const response = await cartApiInstance.patch(`/update/increment/${productId}/${variantId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const decrementQuantity = async ({ productId, variantId }) => {
    try {
        const response = await cartApiInstance.patch(`/update/decrement/${productId}/${variantId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

