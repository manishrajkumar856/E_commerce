import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

import SignupPage from "../features/auth/pages/SignupPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import App from "./App";
import HomePage from "../features/products/pages/HomePage";
import ProductDetailsPage from "../features/products/pages/ProductDetailsPage";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'products/:id',
                element: <ProductDetailsPage />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                index: true,
                element: <div className="p-24 text-center text-4xl font-display font-black italic">WELCOME TO THE <span className="text-primary text-glow-primary">CULT</span></div>
            }
        ]
    },

    {
        path: '/seller',
        element: <App />,
        children: [
            {
                path: 'create-product',
                element: <CreateProduct />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
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