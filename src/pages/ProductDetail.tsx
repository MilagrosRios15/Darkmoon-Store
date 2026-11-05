import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { ApiError, getErrorMessage, getProductById } from '../services/api';
import { CATEGORY_LABELS } from '../types';
import type { CartResult, Product } from '../types';
import { formatPrice } from '../utils/format';
import { getStockStatus } from '../utils/stock';

function getCatalogOrigin(state: unknown): string | null {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as { from: unknown }).from;

    if (typeof from === 'string' && from.startsWith('/products')) {
      return from;
    }
  }

  return null;
}

// Resultado de una carga del producto.
interface DetailState {
  key: string;
  product: Product | null;
  notFound: boolean;
  error: string | null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState('1');
  const [feedback, setFeedback] = useState<CartResult | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [loaded, setLoaded] = useState<DetailState | null>(null);

  const catalogOrigin = getCatalogOrigin(location.state);
  const backPath = catalogOrigin ?? '/products';
  const productId = Number(id);
  const validId = Number.isInteger(productId) && productId > 0;
  const requestKey = `${productId}#${reloadCount}`;

  // Pide el producto al backend: GET /api/products/{id}
  useEffect(() => {
    if (!validId) return;

    const controller = new AbortController();

    getProductById(productId, controller.signal)
      .then((product) => {
        if (!controller.signal.aborted) {
          setLoaded({ key: requestKey, product, notFound: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        // 404: el servidor respondió que el producto no existe.
        if (error instanceof ApiError && error.status === 404) {
          setLoaded({ key: requestKey, product: null, notFound: true, error: null });
          return;
        }

        // Cualquier otro error: servidor caído, sin conexión, etc.
        setLoaded({
          key: requestKey,
          product: null,
          notFound: false,
          error: getErrorMessage(error, 'Intentá de nuevo en unos segundos.'),
        });
      });

    return () => controller.abort();
  }, [productId, requestKey, validId]);

  const current = loaded !== null && loaded.key === requestKey ? loaded : null;
  const isLoading = validId && current === null;
  const notFound = !validId || current?.notFound === true;
  const product = current?.product ?? null;
  const productName = product?.name;

  useEffect(() => {
    if (productName) {
      document.title = `${productName} | DarkMoon Store`;
    } else if (notFound) {
      document.title = 'Producto no encontrado | DarkMoon Store';
    }

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, [productName, notFound]);

  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    const plainClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;

    if (catalogOrigin && plainClick) {
      event.preventDefault();
      navigate(-1);
    }
  };

  const backLink = (
    <Link to={backPath} className="back-link" onClick={handleBack}>
      ← Volver al catálogo
    </Link>
  );

  if (isLoading) {
    return (
      <div>
        {backLink}
        <p className="status-message" role="status">
          Cargando producto...
        </p>
      </div>
    );
  }

  if (current?.error) {
    return (
      <div>
        {backLink}
        <div className="status-error" role="alert">
          <h2>No se pudo cargar el producto.</h2>
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
      </div>
    );
  }

  if (notFound || product === null) {
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
      {backLink}

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