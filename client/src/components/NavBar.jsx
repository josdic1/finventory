
import {useApp} from "../hooks/useApp";
import { NavLink } from "react-router-dom";


export function NavBar() {
    const { userInfo, logout, loading, setShowStateBar, showStateBar } = useApp(); 

    if (loading) return <p>Loading...</p>;

    return (
        <nav>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                {userInfo?.id ? (
                    <>
                        <li>Welcome, {userInfo.name.toUpperCase()}!</li>
                        <li><NavLink to="/products/new">New Product</NavLink></li>
                        <li><NavLink to="/dashboard">Backend</NavLink></li>
                        <li><button onClick={() => setShowStateBar(!showStateBar)}>State</button></li>
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