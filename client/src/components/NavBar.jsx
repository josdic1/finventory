
import {useApp} from "../hooks/useApp";
import { NavLink, useLocation } from "react-router-dom";
import './NavBar.css'


export function NavBar() {
    const { userInfo, logout, loading, setShowStateBar, showStateBar } = useApp(); 
    const location = useLocation();

    if (loading) return <p>Loading...</p>;

      const isHomePage = location.pathname === '/';
    return (
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                {userInfo?.id ? (
                    <>
                        <li>Welcome, {userInfo.name.toUpperCase()}!</li>
                        <li><NavLink to="/products/new">New Product</NavLink></li>
                        {/* <li><NavLink to="/dashboard">Backend</NavLink></li>*/}
                        {/* <li><NavLink to="/schema">Schema</NavLink></li> */}
                        {isHomePage && <li><button onClick={() => setShowStateBar(!showStateBar)}>Help</button></li>}
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/login">Login</NavLink></li>
                        {/* <li><NavLink to="/signup">Register</NavLink></li> */}
                    </>
                )}
            </ul>
        </nav>
    );
}