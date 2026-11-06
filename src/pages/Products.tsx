import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getErrorMessage, getProducts } from '../services/api';
import { CATEGORIES, CATEGORY_LABELS, isCategory } from '../types';
import type { Category, Product } from '../types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Resultado de una carga: a qué pedido corresponde, los productos o el error.
interface CatalogState {
  key: string;
  products: Product[];
  error: string | null;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reloadCount, setReloadCount] = useState(0);
  const [loaded, setLoaded] = useState<CatalogState | null>(null);

  const categoryParam = searchParams.get('category');
  const activeCategory: Category | null = isCategory(categoryParam)
    ? categoryParam
    : null;
  const invalidCategory =
    categoryParam !== null && categoryParam !== '' && activeCategory === null;
  const searchTerm = (searchParams.get('search') ?? '').trim();

  // Identifica el pedido actual: cambia con la categoría o al reintentar.
  const requestKey = `${activeCategory ?? 'todas'}#${reloadCount}`;

  // Pide los productos al backend cada vez que cambia la categoría.
  useEffect(() => {
    const controller = new AbortController();

    getProducts(activeCategory ?? undefined, controller.signal)
      .then((products) => {
        if (!controller.signal.aborted) {
          setLoaded({ key: requestKey, products, error: null });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoaded({
          key: requestKey,
          products: [],
          error: getErrorMessage(error, 'Intentá de nuevo en unos segundos.'),
        });
      });

    // Si la categoría cambia antes de que llegue la respuesta, se cancela
    // la petición vieja para que no pise a la nueva.
    return () => controller.abort();
  }, [activeCategory, requestKey]);

  useEffect(() => {
    const section = activeCategory ? CATEGORY_LABELS[activeCategory] : 'Todos';
    document.title = `${section} – Productos | DarkMoon Store`;

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, [activeCategory]);

  // Si el resultado guardado no es del pedido actual, todavía está cargando.
  const current = loaded !== null && loaded.key === requestKey ? loaded : null;

  // La categoría ya la filtró el backend; acá solo se aplica la búsqueda.
  const visibleProducts = (current?.products ?? []).filter(
    (product) =>
      searchTerm === '' ||
      normalize(`${product.name} ${product.description}`).includes(
        normalize(searchTerm),
      ),
  );

  const handleCategoryChange = (category: Category | null) => {
    const next = new URLSearchParams(searchParams);

    if (category === null) {
      next.delete('category');
    } else {
      next.set('category', category);
    }

    setSearchParams(next);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  return (
    <div>
      <h1>Productos</h1>

      <div className="filters" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className={activeCategory === null ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleCategoryChange(null)}
        >
          Todas
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={
              activeCategory === category ? 'filter-btn active' : 'filter-btn'
            }
            onClick={() => handleCategoryChange(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {invalidCategory && (
        <p className="notice">
          La categoría «{categoryParam}» no existe. Mostrando todos los
          productos.
        </p>
      )}

      {searchTerm !== '' && (
        <p className="search-summary">
          Resultados para «{searchTerm}»
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={clearSearch}
          >
            Limpiar búsqueda
          </button>
        </p>
      )}

      {current === null ? (
        <p className="status-message" role="status">
          Cargando productos...
        </p>
      ) : current.error !== null ? (
        <div className="status-error" role="alert">
          <h2>No se pudieron cargar los productos.</h2>
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
      ) : visibleProducts.length === 0 ? (
        <div className="empty-results">
          {searchTerm !== '' ? (
            <>
              <p>No encontramos productos que coincidan con tu búsqueda.</p>
              <p>Probá con otra palabra o limpiá la búsqueda.</p>
            </>
          ) : (
            <p>Por ahora no hay productos en esta categoría.</p>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}