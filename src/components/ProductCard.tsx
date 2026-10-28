import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { useCart } from '../context/CartContext';
import { CATEGORY_LABELS } from '../types';
import type { CartResult, Product } from '../types';
import { formatPrice } from '../utils/format';
import { getStockStatus } from '../utils/stock';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState<CartResult | null>(null);

  const stock = getStockStatus(product.stock);
  const outOfStock = stock.level === 'out';
  const detailPath = `/products/${product.id}`;

  const handleAdd = () => {
    setFeedback(addToCart(product, 1));
  };

  return (
    <article className="product-card">
      <Link
        to={detailPath}
        className="product-image"
        aria-hidden="true"
        tabIndex={-1}
      >
        <ProductImage product={product} />
      </Link>

      <div className="product-body">
        <span className="product-category">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="product-name">
          <Link to={detailPath}>{product.name}</Link>
        </h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className={`stock-status stock-${stock.level}`}>
          <span className="stock-dot" aria-hidden="true" />
          {stock.label}
        </p>

        <div className="product-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={outOfStock}
          >
            Agregar al carrito
          </button>
          <Link to={detailPath} className="btn btn-secondary">
            Ver detalle
          </Link>
        </div>

        {feedback && (
          <p
            className={feedback.ok ? 'feedback ok' : 'feedback error'}
            role="status"
          >
            {feedback.message}
          </p>
        )}
      </div>
    </article>
  );
}
