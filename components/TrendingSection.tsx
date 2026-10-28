'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TrendingSectionProps {
  products: any[];
}

export default function TrendingSection({ products }: TrendingSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: 'All Trending' },
    { id: "Women's fashion", label: "Women's" },
    { id: "Men's fashion", label: "Men's" },
    { id: 'Beauty and personal care', label: 'Beauty' },
    { id: 'Electronics and mobile accessories', label: 'Electronics' },
    { id: 'Home and kitchen', label: 'Home' },
    { id: 'Bags and accessories', label: 'Bags' },
  ];

  const filteredProducts = activeTab === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeTab).slice(0, 8);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#E9E1F5] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#7962B5] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#D94F70]" />
            Trending Right Now
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633] tracking-tight">
            Trending Products
          </h2>
          <p className="text-xs sm:text-sm text-[#77717F] mt-1">
            Top picks loved by shoppers across India this week.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#7962B5] text-white shadow-xs'
                  : 'bg-white border border-[#E9E1F5] text-[#77717F] hover:border-[#B9A7E8] hover:text-[#7962B5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#B9A7E8] bg-white text-[#7962B5] hover:bg-[#7962B5] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs group"
        >
          <span>View All Products</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
