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

    return (
        <>
            {showStateBar && <StateBar />}
            
            {/* 💡 START OF THE LEGIT HEADER */}
            <header style={{ 
                borderBottom: '1px solid #ddd', 
                paddingBottom: '10px', 
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: '0 0 5px 0', fontSize: '1.8em', color: '#0ea5e9' }}>
                    📦 Your Product Categories
                </h2>
                <p style={{ margin: 0, fontSize: '0.9em', color: '#c0b5b5ff' }}>
                    Click any category below to view and manage its associated products.
                </p>
            </header>
            {/* 💡 END OF THE LEGIT HEADER */}
            
            <UserCategoriesList />
        </>
    );
}