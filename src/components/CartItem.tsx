import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORY_ICONS } from '../types';
import type { CartLine, CartResult } from '../types';
import { getLineSubtotal } from '../utils/cart';
import { formatPrice } from '../utils/format';

interface CartItemProps {
  line: CartLine;
}

export default function CartItem({ line }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const [feedback, setFeedback] = useState<CartResult | null>(null);
  const { product, quantity } = line;

  const handleChange = (newQuantity: number) => {
    const result = updateQuantity(product.id, newQuantity);
    setFeedback(result.ok ? null : result);
  };

  return (
    <article className="cart-item">
      <div className="cart-item-icon">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span>{CATEGORY_ICONS[product.category]}</span>
        )}
      </div>

      <div className="cart-item-info">
        <Link to={`/products/${product.id}`} className="cart-item-name">
          {product.name}
        </Link>
        <p className="cart-item-detail">{formatPrice(product.price)} c/u</p>
        <p className="cart-item-detail">Stock disponible: {product.stock}</p>
      </div>

      <div className="quantity-control">
        <button
          type="button"
          className="qty-btn"
          aria-label={`Disminuir cantidad de ${product.name}`}
          onClick={() => handleChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className="quantity-value" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className="qty-btn"
          aria-label={`Aumentar cantidad de ${product.name}`}
          onClick={() => handleChange(quantity + 1)}
          disabled={quantity >= product.stock}
        >
          +
        </button>
      </div>

      <div className="cart-item-subtotal">
        <span>Subtotal</span>
        <strong>{formatPrice(getLineSubtotal(line))}</strong>
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => removeFromCart(product.id)}
      >
        Eliminar
      </button>

      {feedback && (
        <p className="feedback error cart-item-feedback" role="alert">
          {feedback.message}
        </p>
      )}
    </article>
  );
}
