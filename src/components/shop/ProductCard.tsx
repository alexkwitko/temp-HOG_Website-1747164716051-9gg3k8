import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  handle: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  handle,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
      <Link to={`/shop/products/${handle}`} className="block h-64 overflow-hidden">
        <img
          src={imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-4">
        <Link to={`/shop/products/${handle}`} className="block">
          <h3 className="mb-1 text-lg font-medium text-text hover:text-red-600">{title}</h3>
        </Link>
        <p className="mb-2 line-clamp-2 text-sm text-text">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-text">${price.toFixed(2)}</span>
          <button
            className="rounded bg-background px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
            onClick={() => {
              // Add to cart functionality will be implemented later
              console.log(`Added ${title} to cart`);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 