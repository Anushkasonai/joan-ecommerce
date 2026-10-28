import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getCartItems } from '@/lib/actions/cartActions';
import { getProductById } from '@/lib/db';
import CheckoutPageClient from '@/components/CheckoutPageClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface CheckoutPageProps {
  searchParams: Promise<{ promo?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const cart = await getCartItems();
  if (cart.length === 0) {
    redirect('/cart');
  }

  const resolvedCart = cart.map(item => {
    const product = getProductById(item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      product: product ? {
        name: product.name,
        price: product.price,
        image: product.image
      } : { name: 'Unknown', price: 0, image: '' }
    };
  });

  const params = await searchParams;
  const promo = params.promo || null;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-[#E9E1F5] pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#292633]">Delivery & Checkout</h1>
        <p className="text-xs text-[#77717F] mt-1">Provide your delivery address and choose your payment method.</p>
      </div>

      <CheckoutPageClient cartItems={resolvedCart} appliedPromo={promo} />
    </div>
  );
}
