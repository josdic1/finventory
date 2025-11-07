import { NavLink } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export function NavBar() {
    const { userInfo } = useApp();

    return (
        <nav>
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
            </ul>
        </nav>
    )
}