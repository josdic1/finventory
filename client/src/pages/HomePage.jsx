import { useApp } from "../hooks/useApp";

export function HomePage() {
    const { loading } = useApp();

if (loading) return <p>Loading...</p>;
    return (
        <>
            <h1>Home Page</h1>

        </>
    )
}