export const CATEGORIES = [
  'disfraces',
  'decoracion',
  'accesorios',
  'maquillaje',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  disfraces: 'Disfraces',
  decoracion: 'Decoración',
  accesorios: 'Accesorios',
  maquillaje: 'Maquillaje',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  disfraces: '🧛',
  decoracion: '🎃',
  accesorios: '🎭',
  maquillaje: '💄',
};

export function isCategory(value: string | null): value is Category {
  return CATEGORIES.some((category) => category === value);
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image?: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface CartResult {
  ok: boolean;
  message: string;
}
