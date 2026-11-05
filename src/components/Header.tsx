import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanTerm = term.trim();
    if (cleanTerm === '') return;

    navigate(`/products?search=${encodeURIComponent(cleanTerm)}`);
    setTerm('');
    setSearchOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link
          to="/"
          className="brand"
          aria-label="DarkMoon Store, ir al inicio"
        >
          <img
            className="brand-mark"
            src="/images/logo.jpg"
            alt=""
            width="40"
            height="40"
          />
          <span className="brand-text">
            <span className="brand-name">DarkMoon Store</span>
            <span className="brand-tagline">Tienda de Halloween</span>
          </span>
        </Link>

        {searchOpen ? (
          <form
            id="header-search"
            className="header-search"
            role="search"
            onSubmit={handleSubmit}
          >
            <label htmlFor="header-search-input" className="sr-only">
              Buscar productos
            </label>
            <input
              id="header-search-input"
              ref={inputRef}
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar productos..."
              autoComplete="off"
              maxLength={60}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Buscar
            </button>
          </form>
        ) : (
          <nav className="nav" aria-label="Navegación principal">
            <NavLink to="/" end>
              Inicio
            </NavLink>
            <NavLink to="/products">Productos</NavLink>
            <NavLink to="/cart">
              Carrito <span className="cart-badge">{totalItems}</span>
            </NavLink>
          </nav>
        )}

        <button
          type="button"
          className="header-search-btn"
          aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar productos'}
          aria-expanded={searchOpen}
          aria-controls="header-search"
          onClick={() => setSearchOpen((open) => !open)}
        >
          {searchOpen ? <CloseIcon /> : <SearchIcon />}
        </button>
      </div>
    </header>
  );
}