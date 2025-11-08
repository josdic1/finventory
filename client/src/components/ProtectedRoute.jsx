import { Navigate } from 'react-router-dom';
import { useApp } from '../contexts/UserContext';

export function ProtectedRoute({ children }) {
    const { userInfo, loading } = useApp();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}