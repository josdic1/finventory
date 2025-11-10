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

    // Navigate component used bec redirection is triggered by a rendering condition
    return (
        <>
            {showStateBar ? <StateBar /> : '' }
            <UserCategoriesList />
      
        </>
    );
}