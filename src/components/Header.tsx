import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <Link
          to="/"
          className="brand"
          aria-label="DarkMoon Store, ir al inicio"
        >
          <svg
            className="brand-mark"
            viewBox="0 0 24 24"
            width="34"
            height="34"
            aria-hidden="true"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="currentColor"
            />
          </svg>
          <span className="brand-text">
            <span className="brand-name">DarkMoon Store</span>
            <span className="brand-tagline">Tienda de Halloween</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/products">Productos</NavLink>
          <NavLink to="/cart">
            Carrito <span className="cart-badge">{totalItems}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}