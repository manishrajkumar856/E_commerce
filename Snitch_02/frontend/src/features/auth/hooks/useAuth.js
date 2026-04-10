import { useDispatch } from "react-redux"
import { setError, setUser } from "../state/auth.slice";
import { registerUser } from "../service/auth.api";

export const useAuth = () => {
    const dispatch = useDispatch();


    const handleRegister = async ({ fullname, email, password, contact, isSeller = false }) => {
        try {
            const data = await registerUser({ fullname, email, password, contact, isSeller })
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error));
            return error;
        }
    }


    const handleLogin = async ({ email, password }) => {
        try {
            const data = await loginUser({ email, password })
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error));
            return error;
        }
    }


    return { handleRegister, handleLogin }
}