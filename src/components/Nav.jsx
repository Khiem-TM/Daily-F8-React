import { NavLink } from "react-router-dom";

export default function Nav() {
    const activeClass = ({ isActive }) =>
        isActive
            ? "bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium"
            : "text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

    return (
        <nav style={{ padding: '12px' }}>
            <NavLink className={activeClass} to="/">Home</NavLink>
            <NavLink className={activeClass} to="/about">About</NavLink>
            <NavLink className={activeClass} to="/contact">Contact</NavLink>
            <NavLink className={activeClass} to="/products">Products</NavLink>
        </nav>
    );
}
