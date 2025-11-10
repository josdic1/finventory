import { useApp } from "../hooks/useApp";
import { UserCategoriesList } from "../components/UserCategoriesList";
import { StateBar } from "../components/StateBar";
import { Navigate } from "react-router-dom"; 

export function HomePage() {
    const { loading, userInfo, showStateBar } = useApp(); 


    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userInfo) {
        return <Navigate to="/login" replace />; 
    }

    // Only show StateBar when on exact home page
  

    return (
        <>
            {showStateBar && <StateBar />}
            <UserCategoriesList />
        </>
    );
}