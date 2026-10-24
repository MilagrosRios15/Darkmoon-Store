import { Link } from 'react-router-dom';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../types';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <p className="hero-kicker">Colección Halloween 2026</p>
        <h1>Bienvenido a DarkMoon Store</h1>
        <p>
          Disfraces, decoración, accesorios y maquillaje para una noche de
          Halloween inolvidable. Elegí tus favoritos, armá tu carrito y
          prepará el susto perfecto.
        </p>
        <Link to="/products" className="btn btn-primary">
          Ver catálogo
        </Link>
      </section>

      <section>
        <h2>Explorá por categoría</h2>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className="category-tile"
            >
              <span className="category-icon">{CATEGORY_ICONS[category]}</span>
              <span>{CATEGORY_LABELS[category]}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}