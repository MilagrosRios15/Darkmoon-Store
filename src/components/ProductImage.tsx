import { useState } from 'react';
import { CATEGORY_ICONS } from '../types';
import type { Product } from '../types';

interface ProductImageProps {
  product: Product;
}

export default function ProductImage({ product }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="image-fallback" role="img" aria-label={product.name}>
      {CATEGORY_ICONS[product.category]}
    </span>
  );
}
