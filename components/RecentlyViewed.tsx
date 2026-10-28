'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { History, Sparkles } from 'lucide-react';

interface RecentlyViewedProps {
  allProducts: any[];
}

export default function RecentlyViewed({ allProducts }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('joan_recently_viewed');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        const matches = ids
          .map((id) => allProducts.find((p) => p.id === id))
          .filter(Boolean);
        if (matches.length > 0) {
          setRecentProducts(matches.slice(0, 4));
          return;
        }
      }
    } catch (e) {
      // fallback
    }
    // Fallback: Show curated fresh arrivals
    setRecentProducts(allProducts.slice(4, 8));
  }, [allProducts]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 border-b border-[#E9E1F5] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#7962B5] text-xs font-bold uppercase tracking-wider mb-2">
            <History className="h-3.5 w-3.5 text-[#7962B5]" />
            Your Browsing History
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633] tracking-tight">
            Recently Viewed & Inspired For You
          </h2>
          <p className="text-xs sm:text-sm text-[#77717F] mt-1">
            Pick up right where you left off.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

