import React from 'react';
import { getCartItems } from '@/lib/actions/cartActions';
import { getProductById } from '@/lib/db';
import CartPageClient from '@/components/CartPageClient';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cartItems = await getCartItems();
  
  // Resolve product details for each cart item
  const resolvedItems = cartItems
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          stock: product.stock
        }
      };
    })
    .filter(Boolean) as any[];

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-[#E9E1F5] pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#292633]">Shopping Cart</h1>
        <p className="text-xs text-[#77717F] mt-1">Review your items and proceed to secure checkout.</p>
      </div>

      <CartPageClient initialItems={resolvedItems} />
    </div>
  );
}
