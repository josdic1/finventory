import { useApp } from "../hooks/useApp";
import { StateBar } from "../components/StateBar";
import { UserCategoriesList } from "../components/UserCategoriesList";

export function HomePage() {
    const { loading } = useApp();

if (loading) return <p>Loading...</p>;
    return (
        <>
        <StateBar />
        <UserCategoriesList />

        </>
    )
}