import { NavLink } from "react-router-dom";

export default function Nav() {
    const baseStyles = `
        relative px-5 py-2.5 rounded-xl font-semibold text-sm
        transition-all duration-300 ease-out
        hover:scale-105
    `;

    const activeClass = ({ isActive }) =>
        isActive
            ? `${baseStyles} bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200`
            : `${baseStyles} text-slate-600 hover:text-indigo-600 hover:bg-indigo-50`;

    return (
        <nav style={{ 
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                SHOP
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <NavLink className={activeClass} to="/">Home</NavLink>
                <NavLink className={activeClass} to="/about">About</NavLink>
                <NavLink className={activeClass} to="/contact">Contact</NavLink>
                <NavLink className={activeClass} to="/products">Products</NavLink>
            </div>
        </nav>
    );
}
