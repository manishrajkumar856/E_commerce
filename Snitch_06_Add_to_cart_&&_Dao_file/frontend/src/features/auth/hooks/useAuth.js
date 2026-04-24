import { useDispatch, useSelector } from "react-redux"
import { setError, setLoading, setUser } from "../state/auth.slice";
import { registerUser, loginUser, getMe } from "../service/auth.api";
import { toast } from "react-toastify";


export const useAuth = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);




    const handleRegister = async ({ fullname, email, password, contact, isSeller = false }) => {
        try {
            const data = await registerUser({ fullname, email, password, contact, isSeller })
            dispatch(setUser(data.user));
            toast.success("Account created successfully!");
            return data;
        } catch (error) {
            dispatch(setError(error));
            toast.error(error?.response?.data?.message || "Registration failed");
            return error;
        }
    }


    const handleLogin = async ({ email, password }) => {
        try {
            const data = await loginUser({ email, password })
            dispatch(setUser(data.user));
            toast.success(`Welcome back, ${data.user.fullname}!`);
        } catch (error) {
            dispatch(setError(error));
            toast.error(error?.response?.data?.message || "Login failed");
            return error;
        }
    }


    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            console.log(error);
        }
        finally {
            dispatch(setLoading(false));
        }
    }


    const handleLogout = () => {
        dispatch(setUser(null));
        toast.info("Logged out successfully");
    }


    return { handleRegister, handleLogin, handleGetMe, handleLogout }
}