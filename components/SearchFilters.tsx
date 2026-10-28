'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';

interface SearchFiltersProps {
  categories: string[];
}

export default function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state initialized from query params
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '0');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');

  // Keep state in sync with URL updates
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '0');
    setSort(searchParams.get('sort') || 'featured');
    setActiveCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Merge updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ minPrice, maxPrice });
  };

  const handleRatingChange = (val: string) => {
    setRating(val);
    applyFilters({ rating: val === '0' ? null : val });
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    applyFilters({ sort: val });
  };

  const handleCategoryChange = (cat: string) => {
    const nextCat = activeCategory === cat ? null : cat;
    setActiveCategory(nextCat || '');
    applyFilters({ category: nextCat });
  };

  const handleClearAll = () => {
    setMinPrice('');
    setMaxPrice('');
    setRating('0');
    setSort('featured');
    setActiveCategory('');
    router.push('/search');
  };

  return (
    <div className="w-full lg:w-64 space-y-5 shrink-0">
      
      {/* Mobile Sorting & Active Filters dropdown */}
      <div className="flex flex-col gap-3 border border-[#E9E1F5] bg-white p-4 rounded-2xl md:hidden shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#292633] flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-[#7962B5]" />
            Sort & Filter Options
          </span>
          <button onClick={handleClearAll} className="text-xs text-[#7962B5] font-bold hover:underline">
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-2.5 py-1.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Customer Reviews</option>
            <option value="discount_desc">Highest Discount</option>
          </select>

          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-2.5 py-1.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Filters container */}
      <div className="hidden md:block space-y-5">
        
        {/* Sort selector */}
        <div className="border border-[#E9E1F5] bg-white p-4 rounded-2xl space-y-2.5 shadow-xs">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#77717F] block">Sort By</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3 py-2 text-xs text-[#292633] font-medium focus:outline-none focus:border-[#7962B5] transition-colors"
          >
            <option value="featured">Featured Selection</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Customer Reviews</option>
            <option value="discount_desc">Highest Discount</option>
          </select>
        </div>

        {/* Categories list */}
        <div className="border border-[#E9E1F5] bg-white p-4 rounded-2xl space-y-2.5 shadow-xs">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#77717F] block">Categories</label>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-left text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#7962B5] text-white font-semibold shadow-xs'
                    : 'text-[#292633] hover:text-[#7962B5] hover:bg-[#F4EFFF]'
                }`}
              >
                <span>{cat}</span>
                {activeCategory === cat && <X className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Price range inputs */}
        <div className="border border-[#E9E1F5] bg-white p-4 rounded-2xl space-y-2.5 shadow-xs">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#77717F] block">Price Range (₹)</label>
          <form onSubmit={handlePriceSubmit} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3 py-1.5 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5]"
              />
              <span className="text-[#77717F]">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3 py-1.5 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-[#F4EFFF] border border-[#B9A7E8] text-xs font-bold text-[#7962B5] hover:bg-[#7962B5] hover:text-white transition-colors"
            >
              Apply Price
            </button>
          </form>
        </div>

        {/* Rating threshold */}
        <div className="border border-[#E9E1F5] bg-white p-4 rounded-2xl space-y-2.5 shadow-xs">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#77717F] block">Customer Rating</label>
          <div className="space-y-2">
            {[4, 3, 2].map((stars) => (
              <button
                key={stars}
                onClick={() => handleRatingChange(stars.toString())}
                className={`w-full flex items-center gap-2 py-1 px-2 rounded-lg text-left text-xs transition-colors ${
                  rating === stars.toString()
                    ? 'bg-[#F4EFFF] text-[#7962B5] font-bold'
                    : 'text-[#292633] hover:bg-[#FFFCF7]'
                }`}
              >
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-[#E9E1F5]'}`}
                    />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            ))}
            {rating !== '0' && (
              <button
                onClick={() => handleRatingChange('0')}
                className="w-full text-left text-xs pt-1.5 text-[#7962B5] font-semibold hover:underline"
              >
                Reset Rating Filter
              </button>
            )}
          </div>
        </div>

        {/* Clear all filters Button */}
        <button
          onClick={handleClearAll}
          className="w-full py-2.5 rounded-xl border border-[#E9E1F5] bg-white text-xs font-bold text-[#77717F] hover:text-[#D94F70] hover:border-[#D94F70]/50 transition-colors uppercase tracking-wider"
        >
          Clear All Filters
        </button>

      </div>

    </div>
  );
}
