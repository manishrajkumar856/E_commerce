import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

import SignupPage from "../features/auth/pages/SignupPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CreateProduct from "../features/products/pages/CreateProduct";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: 'product',
                element: <CreateProduct />
            },
            {
                index: true,
                element: <div className="p-24 text-center text-4xl font-display font-black italic">WELCOME TO THE <span className="text-primary text-glow-primary">CULT</span></div>
            }
        ]
    },
    {
        path: 'login',
        element: <LoginPage />
    },
    {
        path: 'register',
        element: <SignupPage />
    }
]);

export default routes;  