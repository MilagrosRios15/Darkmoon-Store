import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

interface OrderSummary {
  units: number;
  total: number;
}

export default function Cart() {
  const { items, clearCart, totalItems, totalPrice } = useCart();
  const [lastOrder, setLastOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    document.title = 'Carrito | DarkMoon Store';

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) return;

    setLastOrder({ units: totalItems, total: totalPrice });
    clearCart();
  };

  return (
    <div>
      <h1>Carrito</h1>

      {lastOrder && (
        <div className="order-success" role="status">
          <h2>¡Pedido simulado confirmado!</h2>
          <p>
            Compraste {lastOrder.units} unidad(es) por un total de{' '}
            {formatPrice(lastOrder.total)}.
          </p>
          <p>
            Esto es una simulación local: el pedido no se envió a ningún
            servidor ni se guardó en una base de datos.
          </p>
          <Link to="/products" className="btn btn-primary">
            Seguir comprando
          </Link>
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
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Finalizar pedido
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => clearCart()}
              >
                Vaciar carrito
              </button>
              <Link to="/products" className="summary-link">
                ← Seguir comprando
              </Link>
            </div>

            <p className="summary-note">
              Simulación local: al finalizar no se realiza ningún cobro ni se
              envía nada a un servidor.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
