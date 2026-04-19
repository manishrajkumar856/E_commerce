import axios from "axios";

const authApiInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true,
});

export const registerUser = async ({ fullname, email, contact, password, isSeller }) => {
    try {
        const response = await authApiInstance.post('/register', {
            fullname,
            email,
            contact,
            password,
            isSeller,
        });

        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const response = await authApiInstance.post('/login', {
            email,
            password,
        });

        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export const getMe = async () => {
    try {
        const response = await authApiInstance.get('/me');
        return response.data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export default authApiInstance;