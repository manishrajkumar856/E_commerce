import { useDispatch, useSelector } from "react-redux"
import { setError, setUser } from "../state/auth.slice";
import authReducer from '../state/auth.slice';
import { registerUser, loginUser } from "../service/auth.api";


export const useAuth = () => {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);

    


    const handleRegister = async ({ fullname, email, password, contact, isSeller = false }) => {
        try {
            const data = await registerUser({ fullname, email, password, contact, isSeller })
            dispatch(setUser(data.user));
            console.log(user);
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