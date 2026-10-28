export const LOW_STOCK_LIMIT = 5;

export type StockLevel = 'out' | 'low' | 'ok';

export interface StockStatus {
  level: StockLevel;
  label: string;
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return { level: 'out', label: 'Sin stock' };
  }

  if (stock <= LOW_STOCK_LIMIT) {
    return {
      level: 'low',
      label: stock === 1 ? 'Última unidad' : `Últimas ${stock} unidades`,
    };
  }

  return { level: 'ok', label: 'En stock' };
}
