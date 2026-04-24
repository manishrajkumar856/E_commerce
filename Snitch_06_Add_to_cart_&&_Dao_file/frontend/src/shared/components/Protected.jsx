import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children, role = 'buyer' }) => {
    const user = useSelector(state => state.auth.user);
    console.log(user);
    const loading = useSelector(state => state.auth.loading);



    if (loading && !user) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // if (user.role !== role) {
    //     return <Navigate to="/" />
    // }

    return children;
}

export default Protected;