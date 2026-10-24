import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartLine, CartResult, Product } from '../types';
import { getLineSubtotal } from '../utils/cart';

interface CartContextType {
  items: CartLine[];
  addToCart: (product: Product, quantity: number) => CartResult;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => CartResult;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const addToCart = (product: Product, quantity: number): CartResult => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return {
        ok: false,
        message: 'La cantidad debe ser un número entero mayor o igual a 1.',
      };
    }

    if (product.stock <= 0) {
      return { ok: false, message: 'Este producto no tiene stock.' };
    }

    const existing = items.find((item) => item.product.id === product.id);
    const currentQuantity = existing ? existing.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > product.stock) {
      return {
        ok: false,
        message: `No hay stock suficiente. Stock: ${product.stock}, ya en el carrito: ${currentQuantity}.`,
      };
    }

    if (existing) {
      setItems(
        items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    } else {
      setItems([...items, { product, quantity }]);
    }

    return { ok: true, message: 'Producto agregado al carrito.' };
  };

  const removeFromCart = (productId: number) => {
    setItems(items.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number): CartResult => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return {
        ok: false,
        message: 'La cantidad debe ser un número entero mayor o igual a 1.',
      };
    }

    const existing = items.find((item) => item.product.id === productId);

    if (!existing) {
      return { ok: false, message: 'El producto no está en el carrito.' };
    }

    if (quantity > existing.product.stock) {
      return {
        ok: false,
        message: `No hay stock suficiente. Stock máximo: ${existing.product.stock}.`,
      };
    }

    setItems(
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );

    return { ok: true, message: 'Cantidad actualizada.' };
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + getLineSubtotal(item),
    0,
  );

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  return context;
}
