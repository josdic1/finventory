import App from "./App";
import { DebugDashboard } from "./components/DebugDashboard";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProductFormEdit } from "./components/ProductFormEdit";
import { ProductFormNew } from "./components/ProductFormNew";
import { ProductCard } from "./pages/ProductCard";
import { ProtectedWrapper } from "./components/ProtectedWrapper"; 
import { SchemaBuilder } from "./components/SchemaBuilder";

export const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            // --- 1. Public Routes ---
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            
            // --- 2. PROTECTED ROUTES GROUP ---
            // This route object uses the wrapper as the element
            {
                
                element: <ProtectedWrapper />, 
                children: [
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
            },
                 {
                        path: "/dashboard",
                        element: <DebugDashboard />, 
                    },
                       {
                        path: "/schema",
                        element: <SchemaBuilder />, 
                    },
                ],
            },
           
        ]
    },
];