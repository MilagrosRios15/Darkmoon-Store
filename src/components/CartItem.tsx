import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { useCart } from '../context/CartContext';
import { CATEGORY_LABELS } from '../types';
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
  const detailPath = `/products/${product.id}`;

  const handleChange = (newQuantity: number) => {
    const result = updateQuantity(product.id, newQuantity);
    setFeedback(result.ok ? null : result);
  };

  return (
    <article className="cart-item">
      <Link
        to={detailPath}
        className="cart-item-thumb"
        aria-hidden="true"
        tabIndex={-1}
      >
        <ProductImage product={product} />
      </Link>

      <div className="cart-item-info">
        <span className="product-category">
          {CATEGORY_LABELS[product.category]}
        </span>
        <Link to={detailPath} className="cart-item-name">
          {product.name}
        </Link>
        <p className="cart-item-detail">{formatPrice(product.price)} c/u</p>
        <p className="cart-item-detail">Stock disponible: {product.stock}</p>
      </div>

      <div
        className="quantity-control"
        role="group"
        aria-label={`Cantidad de ${product.name}`}
      >
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
        className="btn btn-secondary btn-sm"
        aria-label={`Eliminar ${product.name} del carrito`}
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
