'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Check } from 'lucide-react';
import { useCart } from './CartContext';
import { formatINR, calculateDiscount } from '@/lib/currency';

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    stock: number;
  };
}

interface CartPageClientProps {
  initialItems: CartItemWithProduct[];
}

export default function CartPageClient({ initialItems }: CartPageClientProps) {
  const { cart, updateQty, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  // Merge context quantities with initial resolved product data
  const items = initialItems
    .map((item) => {
      const liveItem = cart.find((c) => c.productId === item.productId);
      if (!liveItem || liveItem.quantity <= 0) return null;
      return {
        ...item,
        quantity: liveItem.quantity,
      };
    })
    .filter(Boolean) as CartItemWithProduct[];

  const handleQtyChange = (productId: string, currentQty: number, change: number) => {
    const nextQty = currentQty + change;
    if (nextQty <= 0) {
      removeFromCart(productId);
    } else {
      updateQty(productId, nextQty);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'JOAN20') {
      setAppliedPromo('JOAN20');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "JOAN20"');
      setAppliedPromo(null);
    }
  };

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const originalSubtotal = items.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const discountSavings = originalSubtotal > subtotal ? originalSubtotal - subtotal : 0;
  
  // Promo code 20% discount
  const promoDiscount = appliedPromo === 'JOAN20' ? Math.round(subtotal * 0.20) : 0;
  
  // Free delivery above ₹499, else ₹49
  const shippingFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const finalTotal = subtotal - promoDiscount + shippingFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-[#E9E1F5] rounded-3xl shadow-xs">
        <div className="p-4 rounded-full bg-[#F4EFFF] text-[#7962B5] mb-5">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#292633]">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-[#77717F] mt-1.5 max-w-sm leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our curated collections and add your favorite finds!
        </p>
        <Link
          href="/search"
          className="mt-6 px-8 py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-xs font-bold text-white uppercase tracking-wider transition-colors shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Items List - Left */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E1F5] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#77717F]">
            Cart Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
          </h3>
          <span className="text-xs text-[#77717F]">Price</span>
        </div>
        
        <div className="space-y-3.5">
          {items.map((item) => {
            const itemDiscount = calculateDiscount(item.product.price, item.product.originalPrice);
            return (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-[#E9E1F5] bg-white shadow-xs hover:border-[#B9A7E8] transition-all"
              >
                {/* Product Thumbnail */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E9E1F5] bg-[#FFFCF7] aspect-square">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7962B5]">{item.product.category}</span>
                  <Link href={`/products/${item.productId}`}>
                    <h4 className="font-semibold text-sm text-[#292633] hover:text-[#7962B5] transition-colors line-clamp-1">
                      {item.product.name}
                    </h4>
                  </Link>

                  <div className="flex items-baseline gap-2 text-xs pt-0.5">
                    <span className="font-bold text-[#292633]">{formatINR(item.product.price)}</span>
                    {itemDiscount > 0 && (
                      <span className="text-[#77717F] line-through">{formatINR(item.product.originalPrice)}</span>
                    )}
                    {itemDiscount > 0 && (
                      <span className="text-[10px] font-bold text-[#D94F70] bg-[#F6DDE8] px-2 py-0.2 rounded-full">
                        {itemDiscount}% off
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#37866A] font-medium pt-0.5">In Stock</p>
                </div>

                {/* Actions: Stepper + Item Subtotal + Remove */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center sm:items-end gap-3 border-t sm:border-t-0 border-[#E9E1F5] pt-3 sm:pt-0">
                  <span className="font-bold text-sm text-[#292633]">
                    {formatINR(item.product.price * item.quantity)}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Stepper */}
                    <div className="flex items-center rounded-xl bg-[#7962B5] text-white px-1.5 py-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.productId, item.quantity, -1)}
                        className="p-1 hover:bg-[#654fa0] rounded-lg transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.productId, item.quantity, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 hover:bg-[#654fa0] rounded-lg transition-colors disabled:opacity-40"
                        title="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      className="p-2 text-[#77717F] hover:text-[#D94F70] hover:bg-[#F6DDE8]/40 rounded-xl transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary - Right Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#292633] border-b border-[#E9E1F5] pb-3">
            Order Summary
          </h3>

          {/* Coupon Code Box */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-[11px] font-bold text-[#77717F] uppercase tracking-wider block">
              Have a Promo Code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try JOAN20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3 py-2 text-xs text-[#292633] uppercase placeholder-[#77717F] focus:outline-none focus:border-[#7962B5]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#F4EFFF] border border-[#B9A7E8] hover:bg-[#7962B5] hover:text-white text-[#7962B5] rounded-xl text-xs font-bold transition-all"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[11px] text-[#D94F70]">{promoError}</p>}
            {appliedPromo && (
              <p className="text-[11px] text-[#37866A] flex items-center gap-1 font-semibold">
                <Check className="h-3.5 w-3.5" />
                Coupon {appliedPromo} applied! (20% Off)
              </p>
            )}
          </form>

          <hr className="border-[#E9E1F5]" />

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-[#77717F]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#292633]">{formatINR(subtotal)}</span>
            </div>

            {discountSavings > 0 && (
              <div className="flex justify-between text-[#37866A]">
                <span>Catalog Savings</span>
                <span className="font-semibold">-{formatINR(discountSavings)}</span>
              </div>
            )}

            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#37866A]">
                <span>Coupon (JOAN20)</span>
                <span className="font-semibold">-{formatINR(promoDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Standard Delivery</span>
              <span className={`font-semibold ${shippingFee === 0 ? 'text-[#37866A]' : 'text-[#292633]'}`}>
                {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
              </span>
            </div>

            {subtotal < 499 && (
              <p className="text-[11px] text-[#7962B5] bg-[#F4EFFF] p-2 rounded-xl">
                Add items worth <strong>{formatINR(499 - subtotal)}</strong> more for FREE delivery!
              </p>
            )}
          </div>

          <hr className="border-[#E9E1F5]" />

          {/* Final Total */}
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-[#292633]">Total Payable</span>
            <span className="text-xl font-bold text-[#7962B5]">{formatINR(finalTotal)}</span>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#7962B5]/25 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#77717F] pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#37866A]" />
            <span>Safe & Secure Indian Checkout</span>
          </div>
        </div>
      </div>

    </div>
  );
}
