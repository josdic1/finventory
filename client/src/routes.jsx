import App from "./App";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProductFormEdit } from "./components/ProductFormEdit";
import { ProductFormNew } from "./components/ProductFormNew";
import { ProductCard } from "./pages/ProductCard";

export const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/products/new",
                element: <ProductFormNew />,
            },
            {
                path: "/products/:id/edit",
                element: <ProductFormEdit />,
            },
                      {
                path: "/products/:id",
                element: <ProductCard />,
            }
        ]
    },
];