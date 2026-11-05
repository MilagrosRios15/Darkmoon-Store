import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getErrorMessage, getProducts } from '../services/api';
import { CATEGORIES, CATEGORY_LABELS } from '../types';
import type { Product } from '../types';

// Uno por categoría: Vampiro, Calabaza, Máscara de Calavera y Kit Zombie.
const FEATURED_IDS = [1, 10, 20, 28];

interface FeaturedState {
  key: number;
  products: Product[];
  error: string | null;
}

export default function Home() {
  const [reloadCount, setReloadCount] = useState(0);
  const [loaded, setLoaded] = useState<FeaturedState | null>(null);

  // Pide los productos al backend y se queda con los destacados.
  useEffect(() => {
    const controller = new AbortController();

    getProducts(undefined, controller.signal)
      .then((products) => {
        if (!controller.signal.aborted) {
          setLoaded({
            key: reloadCount,
            products: products.filter((product) =>
              FEATURED_IDS.includes(product.id),
            ),
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoaded({
          key: reloadCount,
          products: [],
          error: getErrorMessage(error, 'Intentá de nuevo en unos segundos.'),
        });
      });

    return () => controller.abort();
  }, [reloadCount]);

  const current = loaded !== null && loaded.key === reloadCount ? loaded : null;

  return (
    <div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">Colección Halloween 2026</p>
          <h1 id="hero-title">
            <span className="hero-title-light">La noche</span>{' '}
            <span className="hero-title-accent">te pertenece</span>
          </h1>
          <p className="hero-text">
            Disfraces, decoración, accesorios y maquillaje para una noche de
            Halloween inolvidable. Armá tu carrito y prepará el susto
            perfecto.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explorar productos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="home-section" aria-labelledby="categories-title">
        <div className="section-head">
          <h2 id="categories-title">Explorá por categoría</h2>
          <span className="section-line" aria-hidden="true" />
        </div>
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className={`category-tile cat-${category}`}
            >
              <span className="category-label">
                {CATEGORY_LABELS[category]} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-title">
        <div className="section-head">
          <h2 id="featured-title">Productos destacados</h2>
          <span className="section-line" aria-hidden="true" />
          <Link to="/products" className="section-link">
            Ver todos <span aria-hidden="true">→</span>
          </Link>
        </div>

        {current === null ? (
          <p className="status-message" role="status">
            Cargando productos...
          </p>
        ) : current.error !== null ? (
          <div className="status-error" role="alert">
            <h2>No se pudieron cargar los productos destacados.</h2>
            <p>{current.error}</p>
            <div className="status-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setReloadCount((count) => count + 1)}
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {current.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}