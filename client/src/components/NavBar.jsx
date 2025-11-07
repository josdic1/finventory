import { NavLink } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export function NavBar() {
    const { userInfo, logout } = useApp();

    return (
        <nav>
            {userInfo ?
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/products/new">Add New</NavLink>
                </li>
                <li>
                    <NavLink to="/logout">Logout</NavLink>
                </li>
            </ul> : 
            
            <ul>
                <li>
                    <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                    <NavLink to="/register">Register</NavLink>
                </li>
            </ul>
            }
        </nav>
    )
}