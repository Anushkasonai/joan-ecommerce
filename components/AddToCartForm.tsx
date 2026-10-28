'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';

interface AddToCartFormProps {
  productId: string;
  stock: number;
  category?: string;
}

export default function AddToCartForm({ productId, stock, category = '' }: AddToCartFormProps) {
  const router = useRouter();
  const { getItemQty, addToCart } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  const isFashion = category.toLowerCase().includes('fashion') || category.toLowerCase().includes('footwear');
  const sizes = category.toLowerCase().includes('footwear') ? ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] : ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Sage Lavender', 'Ecru Cream', 'Dusty Rose', 'Classic Navy'];

  const handleIncrement = () => {
    if (selectedQty < stock) setSelectedQty(selectedQty + 1);
  };

  const handleDecrement = () => {
    if (selectedQty > 1) setSelectedQty(selectedQty - 1);
  };

  const handleAddToCart = async () => {
    if (stock <= 0) return;
    await addToCart(productId, selectedQty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = async () => {
    if (stock <= 0) return;
    await addToCart(productId, selectedQty);
    router.push('/checkout');
  };

  return (
    <div className="space-y-5">
      {stock > 0 ? (
        <>
          {/* Variants: Size selector when relevant */}
          {isFashion && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#292633] uppercase tracking-wider">
                  Select Size:
                </span>
                {selectedSize && (
                  <span className="text-xs font-semibold text-[#7962B5]">{selectedSize}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-9 min-w-10 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? 'border-[#7962B5] bg-[#7962B5] text-white shadow-xs'
                        : 'border-[#E9E1F5] bg-white text-[#292633] hover:border-[#B9A7E8]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-[#292633] uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-[#E9E1F5] bg-white rounded-xl px-2 py-1 shadow-xs">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={selectedQty <= 1}
                className="p-1 text-[#77717F] hover:text-[#7962B5] disabled:opacity-30 transition-all"
                title="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#292633]">{selectedQty}</span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={selectedQty >= stock}
                className="p-1 text-[#77717F] hover:text-[#7962B5] disabled:opacity-30 transition-all"
                title="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-[#77717F]">({stock} in stock)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-full border border-[#7962B5] bg-[#F4EFFF] hover:bg-[#B9A7E8] text-[#7962B5] hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              {addedNotice ? (
                <>
                  <Check className="h-4 w-4 text-[#37866A]" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#7962B5]/25 hover:shadow-lg active:scale-98"
            >
              <span>Buy Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="border border-[#D94F70]/30 bg-[#F6DDE8]/30 text-[#D94F70] p-4 rounded-2xl text-center font-bold text-sm">
          Currently Out of Stock
        </div>
      )}
    </div>
  );
}
