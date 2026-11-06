import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { createOrder, getErrorMessage } from '../services/api';
import type { Order } from '../types';
import { formatPrice } from '../utils/format';

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime())
    ? isoDate
    : date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Cart() {
  const { items, clearCart, totalItems, totalPrice } = useCart();
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  // Evita enviar el pedido dos veces si se hace doble clic muy rápido.
  const sendingRef = useRef(false);

  useEffect(() => {
    document.title = 'Carrito | DarkMoon Store';

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0 || sendingRef.current) return;

    sendingRef.current = true;
    setSending(true);
    setOrderError(null);
    setLastOrder(null);

    try {
      // Se envían solo ids y cantidades: el backend calcula precios y total.
      const order = await createOrder(
        items.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
      );
      setLastOrder(order);
      // El carrito se vacía SOLO después de que el servidor confirmó.
      clearCart();
    } catch (error) {
      // Si falla, se muestra el error y el carrito se conserva.
      setOrderError(
        getErrorMessage(error, 'Ocurrió un error inesperado. Intentá de nuevo.'),
      );
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const handleClear = () => {
    clearCart();
    setOrderError(null);
  };

  const orderUnits = lastOrder
    ? lastOrder.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <div>
      <h1>Carrito</h1>

      {lastOrder && (
        <div className="order-success" role="status">
          <h2>¡Pedido confirmado!</h2>
          <p>
            Tu pedido <strong>N.º {lastOrder.id}</strong> quedó registrado el{' '}
            {formatDate(lastOrder.createdAt)}.
          </p>
          <p>
            Compraste {orderUnits} unidad(es) por un total de{' '}
            {formatPrice(lastOrder.total)}.
          </p>
          <Link to="/products" className="btn btn-primary">
            Seguir comprando
          </Link>
        </div>
      )}

      {orderError && (
        <div className="order-error" role="alert">
          <h2>No pudimos confirmar tu pedido</h2>
          <p>{orderError}</p>
          <p>
            Tu carrito se mantiene: podés ajustar las cantidades e intentar de
            nuevo.
          </p>
        </div>
      )}

      {items.length === 0 ? (
        !lastOrder && (
          <div className="cart-empty">
            <svg
              className="cart-empty-icon"
              viewBox="0 0 24 24"
              width="56"
              height="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h2>Tu carrito está vacío</h2>
            <p>Explorá el catálogo y elegí algo para tu noche de Halloween.</p>
            <Link to="/products" className="btn btn-primary">
              Ver productos
            </Link>
          </div>
        )
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((line) => (
              <CartItem key={line.product.id} line={line} />
            ))}
          </div>

          <aside className="cart-summary" aria-labelledby="summary-title">
            <h2 id="summary-title">Resumen del pedido</h2>

            <dl className="summary-rows">
              <div className="summary-row">
                <dt>Total de unidades</dt>
                <dd>{totalItems}</dd>
              </div>
              <div className="summary-row summary-total">
                <dt>Total</dt>
                <dd>{formatPrice(totalPrice)}</dd>
              </div>
            </dl>

            <div className="summary-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  void handleCheckout();
                }}
                disabled={items.length === 0 || sending}
                aria-busy={sending}
              >
                {sending ? 'Enviando pedido...' : 'Finalizar pedido'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={sending}
              >
                Vaciar carrito
              </button>
              <Link to="/products" className="summary-link">
                ← Seguir comprando
              </Link>
            </div>

            <p className="summary-note">
              El stock y los precios se confirman con el servidor al finalizar
              el pedido.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}