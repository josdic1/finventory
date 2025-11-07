import App from "./App";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";

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
        ]
    },
];