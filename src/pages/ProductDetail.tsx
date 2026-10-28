import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { CATEGORY_LABELS } from '../types';
import type { CartResult } from '../types';
import { formatPrice } from '../utils/format';
import { getStockStatus } from '../utils/stock';

function getCatalogPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as { from: unknown }).from;

    if (typeof from === 'string' && from.startsWith('/products')) {
      return from;
    }
  }

  return '/products';
}

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState('1');
  const [feedback, setFeedback] = useState<CartResult | null>(null);

  const backPath = getCatalogPath(location.state);
  const productId = Number(id);
  const product = products.find((item) => item.id === productId);
  const productName = product?.name;

  useEffect(() => {
    document.title = productName
      ? `${productName} | DarkMoon Store`
      : 'Producto no encontrado | DarkMoon Store';

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, [productName]);

  if (!product) {
    return (
      <div className="product-missing">
        <h1>Producto no encontrado</h1>
        <p>No existe ningún producto con el identificador «{id}».</p>
        <Link to="/products" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const stock = getStockStatus(product.stock);
  const outOfStock = stock.level === 'out';
  const inCart =
    items.find((line) => line.product.id === product.id)?.quantity ?? 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(addToCart(product, Number(quantity)));
  };

  return (
    <div>
      <Link to={backPath} className="back-link">
        ← Volver al catálogo
      </Link>

      <div className="detail">
        <div className="detail-image">
          <ProductImage key={product.id} product={product} />
        </div>

        <div className="detail-info">
          <span className="product-category">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.description}</p>

          <p className={`stock-status stock-${stock.level}`}>
            <span className="stock-dot" aria-hidden="true" />
            {stock.label}
          </p>
          <p className="stock-info">Stock: {product.stock} unidades</p>
          {inCart > 0 && (
            <p className="stock-info">Ya tenés {inCart} en el carrito.</p>
          )}

          <form className="quantity-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="quantity">Cantidad</label>
            <input
              id="quantity"
              className="quantity-input"
              type="number"
              min={1}
              max={product.stock}
              step={1}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={outOfStock}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={outOfStock}
            >
              Agregar al carrito
            </button>
          </form>

          {feedback && (
            <p
              className={feedback.ok ? 'feedback ok' : 'feedback error'}
              role="status"
            >
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
