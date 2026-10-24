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
        </div>
      )}

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link to="/products" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((line) => (
              <CartItem key={line.product.id} line={line} />
            ))}
          </div>

          <div className="cart-summary">
            <p>
              Total de unidades: <strong>{totalItems}</strong>
            </p>
            <p className="cart-total">Total: {formatPrice(totalPrice)}</p>
            <div className="cart-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => clearCart()}
              >
                Vaciar carrito
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Finalizar pedido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
