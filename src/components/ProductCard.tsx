import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../types';
import type { CartResult, Product } from '../types';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState<CartResult | null>(null);

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    setFeedback(addToCart(product, 1));
  };

  return (
    <article className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span className="product-icon">{CATEGORY_ICONS[product.category]}</span>
        )}
      </div>

      <div className="product-body">
        <span className="product-category">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        {outOfStock && <span className="stock-badge">Sin stock</span>}

        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={outOfStock}
          >
            Agregar
          </button>
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