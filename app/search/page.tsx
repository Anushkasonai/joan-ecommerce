import React from 'react';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import SearchFilters from '@/components/SearchFilters';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { calculateDiscount } from '@/lib/currency';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const queryParams = await searchParams;
  
  const q = queryParams.q || '';
  const category = queryParams.category || '';
  const minPrice = queryParams.minPrice ? parseFloat(queryParams.minPrice) : 0;
  const maxPrice = queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : Infinity;
  const ratingThreshold = queryParams.rating ? parseFloat(queryParams.rating) : 0;
  const sort = queryParams.sort || 'featured';

  // Get all products and categories
  const allProducts = getProducts();
  const categories = [
    "Women's fashion",
    "Men's fashion",
    "Bags and accessories",
    "Beauty and personal care",
    "Electronics and mobile accessories",
    "Home and kitchen",
    "Grocery and daily essentials",
    "Footwear"
  ];

  // Filter products on server
  let filteredProducts = allProducts.filter((product) => {
    // 1. Text search
    if (q) {
      const queryLower = q.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(queryLower);
      const descMatch = product.description ? product.description.toLowerCase().includes(queryLower) : false;
      const catMatch = product.category.toLowerCase().includes(queryLower);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    // 2. Category match
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 3. Price boundary
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }

    // 4. Rating threshold
    if (product.rating < ratingThreshold) {
      return false;
    }

    return true;
  });

  // Sort products
  if (sort === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating_desc') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount_desc') {
    filteredProducts.sort((a, b) => {
      const discA = calculateDiscount(a.price, a.originalPrice);
      const discB = calculateDiscount(b.price, b.originalPrice);
      return discB - discA;
    });
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Search Header Banner */}
      <div className="border-b border-[#E9E1F5] pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#292633]">
            {q ? `Search results for "${q}"` : category ? `${category}` : 'All Products'}
          </h1>
          <p className="text-xs text-[#77717F] mt-1">
            Showing {filteredProducts.length} of {allProducts.length} items available in Indian catalog.
          </p>
        </div>

        {(q || category || minPrice > 0 || maxPrice < Infinity || ratingThreshold > 0 || sort !== 'featured') && (
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B9A7E8] bg-white text-[#7962B5] text-xs font-semibold hover:bg-[#F4EFFF] transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </Link>
        )}
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filters */}
        <SearchFilters categories={categories} />

        {/* Listings Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-dashed border-[#E9E1F5] rounded-3xl p-8 shadow-xs">
              <div className="p-4 bg-[#F4EFFF] text-[#7962B5] rounded-full mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-[#292633] text-lg">No Products Found</h3>
              <p className="text-xs text-[#77717F] max-w-md mt-1 leading-relaxed">
                We couldn't find any products matching your selected search or filter criteria. Try clearing your filters or searching with different keywords.
              </p>
              <Link
                href="/search"
                className="mt-6 px-6 py-2.5 rounded-full bg-[#7962B5] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#654fa0] transition-colors shadow-xs"
              >
                Reset All Filters
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
