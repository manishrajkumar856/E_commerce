import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

import SignupPage from "../features/auth/pages/SignupPage";
import LoginPage from "../features/auth/pages/LoginPage";

const routes = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
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