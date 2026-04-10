import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

const routes = createBrowserRouter([
    {
        path: '/login',
        element: <h1>Login</h1>
    },
    {
        path: '/register',
        element: <h1>Register</h1>
    },
    {
        path: '/',
        element: <AppLayout />
    }
]);

export default routes;  