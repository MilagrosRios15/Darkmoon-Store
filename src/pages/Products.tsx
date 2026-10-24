import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { CATEGORIES, CATEGORY_LABELS, isCategory } from '../types';
import type { Category } from '../types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const activeCategory: Category | null = isCategory(categoryParam)
    ? categoryParam
    : null;
  const invalidCategory =
    categoryParam !== null && categoryParam !== '' && activeCategory === null;

  const visibleProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  useEffect(() => {
    const section = activeCategory ? CATEGORY_LABELS[activeCategory] : 'Todos';
    document.title = `${section} – Productos | DarkMoon Store`;

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, [activeCategory]);

  const handleCategoryChange = (category: Category | null) => {
    if (category === null) {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
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

      <p className="results-count">
        Mostrando {visibleProducts.length} producto(s)
      </p>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
