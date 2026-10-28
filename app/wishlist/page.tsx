import React from 'react';
import { getWishlistItems } from '@/lib/actions/cartActions';
import { getProductById } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const wishlistItems = await getWishlistItems();
  
  // Resolve product details for each wishlist item
  const resolvedProducts = wishlistItems
    .map((id) => getProductById(id))
    .filter(Boolean) as any[];

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-[#E9E1F5] pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#292633]">Your Wishlist</h1>
        <p className="text-xs text-[#77717F] mt-1">Keep track of your favorite items and add them to cart anytime.</p>
      </div>

      {resolvedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {resolvedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={true}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-[#E9E1F5] rounded-3xl shadow-xs">
          <div className="p-4 rounded-full bg-[#F6DDE8] text-[#D94F70] mb-5">
            <Heart className="h-10 w-10 fill-[#D94F70]" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#292633]">Your Wishlist is Empty</h2>
          <p className="text-xs text-[#77717F] mt-1.5 max-w-sm leading-relaxed">
            Save items that catch your eye by tapping the heart icon on any product card, and find them right here later.
          </p>
          <Link
            href="/search"
            className="mt-6 px-8 py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-xs font-bold text-white uppercase tracking-wider transition-colors shadow-xs"
          >
            Explore Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
