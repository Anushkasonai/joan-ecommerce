'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Plus, Minus, Star, StarHalf, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { formatINR, calculateDiscount } from '@/lib/currency';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice: number;
    category: string;
    image: string;
    rating: number;
    reviewCount: number;
    stock?: number;
  };
  isWishlisted?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { getItemQty, addToCart, updateQty, isWishlisted, toggleWishlist } = useCart();

  const qty = getItemQty(product.id);
  const wishlisted = isWishlisted(product.id);
  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const maxStock = product.stock ?? 99;
    if (qty < maxStock) {
      updateQty(product.id, qty + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQty(product.id, qty - 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-[#E9E1F5]" />);
      }
    }
    return stars;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E9E1F5] bg-white shadow-[0_4px_16px_rgba(41,38,51,0.04)] hover:shadow-[0_12px_24px_rgba(121,98,181,0.12)] hover:border-[#B9A7E8] transition-all duration-300 hover:-translate-y-1">
      {/* Product Image Link */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square w-full overflow-hidden bg-[#FFFCF7]">
        {/* Wishlist Button Overlay */}
        <button
          onClick={handleToggleWishlist}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#E9E1F5] bg-white/90 backdrop-blur-sm text-[#77717F] hover:text-[#D94F70] hover:border-[#B9A7E8] transition-all duration-200 shadow-xs"
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-[#D94F70] text-[#D94F70]' : ''}`} />
        </button>

        {/* Subtle Pink Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#F6DDE8] border border-[#F6DDE8] px-2.5 py-0.5 text-[10px] font-bold text-[#D94F70] uppercase tracking-wider shadow-xs">
            {discount}% OFF
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Pill */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7962B5] mb-1 line-clamp-1">
          {product.category}
        </span>
        
        {/* Product Title */}
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-semibold text-[#292633] line-clamp-1 group-hover:text-[#7962B5] transition-colors leading-snug" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.description && (
          <p className="mt-1 text-xs text-[#77717F] line-clamp-1 font-light leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Ratings */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
          <span className="text-[11px] text-[#77717F] font-medium">({product.reviewCount})</span>
        </div>

        {/* Price & Quick-Add Button Footer */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#E9E1F5] pt-3">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#292633]">{formatINR(product.price)}</span>
            {discount > 0 && (
              <span className="text-xs text-[#77717F] line-through font-normal">{formatINR(product.originalPrice)}</span>
            )}
          </div>

          {/* Blinkit Quick-Add Interaction */}
          <div>
            {qty > 0 ? (
              <div className="flex items-center rounded-xl bg-[#7962B5] text-white px-1.5 py-1 shadow-sm">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-1 hover:bg-[#654fa0] rounded-lg transition-colors"
                  title="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-1 hover:bg-[#654fa0] rounded-lg transition-colors"
                  title="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#B9A7E8] bg-white hover:bg-[#7962B5] text-[#7962B5] hover:text-white text-xs font-bold transition-all shadow-xs"
                title="Add to Cart"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
