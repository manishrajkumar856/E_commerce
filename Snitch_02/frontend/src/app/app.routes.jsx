import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

import SignupPage from "../features/auth/pages/SignupPage";

const routes = createBrowserRouter([
    {
        path: '/login',
        element: <h1>Login</h1>
    },
    {
        path: '/register',
        element: <SignupPage />
    },
    {
        path: '/',
        element: <AppLayout />
    }
]);

export default routes;  