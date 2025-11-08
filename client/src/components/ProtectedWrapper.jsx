import { Navigate, Outlet } from 'react-router-dom'; 
import { useApp } from '../hooks/useApp';


export function ProtectedWrapper() { 

    const { userInfo, loading } = useApp();
    
    if (loading) {
        return <div>Loading...</div>; 
    }
    
    // 2. Unauthenticated: Redirect to login
    if (!userInfo) {
        return <Navigate to="/login" replace />; 
    }
    
    return <Outlet />; 
}