import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { CATEGORIES, CATEGORY_LABELS, isCategory } from '../types';
import type { Category } from '../types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const activeCategory: Category | null = isCategory(categoryParam)
    ? categoryParam
    : null;
  const invalidCategory =
    categoryParam !== null && categoryParam !== '' && activeCategory === null;
  const searchTerm = (searchParams.get('search') ?? '').trim();

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === null || product.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      normalize(`${product.name} ${product.description}`).includes(
        normalize(searchTerm),
      );

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const section = activeCategory ? CATEGORY_LABELS[activeCategory] : 'Todos';
    document.title = `${section} – Productos | DarkMoon Store`;

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, [activeCategory]);

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

      <p className="results-count">
        Mostrando {visibleProducts.length} producto(s)
      </p>

      {visibleProducts.length === 0 ? (
        <div className="empty-results">
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
          <p>Probá con otra palabra o limpiá la búsqueda.</p>
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