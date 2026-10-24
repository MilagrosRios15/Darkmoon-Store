import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <Link to="/" className="logo">
        DarkMoon Store
      </Link>

      <nav className="nav">
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/products">Productos</NavLink>
        <NavLink to="/cart">
          Carrito <span className="cart-badge">{totalItems}</span>
        </NavLink>
      </nav>
    </header>
  );
}