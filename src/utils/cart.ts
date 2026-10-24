import type { CartLine } from '../types';

export function getLineSubtotal(line: CartLine): number {
  return line.product.price * line.quantity;
}
