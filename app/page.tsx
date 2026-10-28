import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import TrendingSection from '@/components/TrendingSection';
import PromoBanner from '@/components/PromoBanner';
import RecentlyViewed from '@/components/RecentlyViewed';
import NewsletterSection from '@/components/NewsletterSection';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Flame,
  Star,
  CheckCircle2,
} from 'lucide-react';

export default async function Home() {
  const products = getProducts();

  // Categories for Section 4
  const categoriesList = [
    {
      name: "Women's Fashion",
      subtitle: "Kurtas, Dresses & Sarees",
      href: "/search?category=Women%27s+fashion",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
      tag: "Trending"
    },
    {
      name: "Men's Fashion",
      subtitle: "T-Shirts, Shirts & Jeans",
      href: "/search?category=Men%27s+fashion",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
      tag: "Everyday"
    },
    {
      name: "Bags & Accessories",
      subtitle: "Totes, Wallets & Jewellery",
      href: "/search?category=Bags+and+accessories",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
      tag: "Popular"
    },
    {
      name: "Beauty & Personal Care",
      subtitle: "Serums, Cleansers & Sunscreens",
      href: "/search?category=Beauty+and+personal+care",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
      tag: "Organic"
    },
    {
      name: "Electronics & Mobile",
      subtitle: "Audio, Fast Chargers & Cables",
      href: "/search?category=Electronics+and+mobile+accessories",
      image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=600&auto=format&fit=crop",
      tag: "Best Value"
    },
    {
      name: "Home & Kitchen",
      subtitle: "Air Fryers, Bottles & Decor",
      href: "/search?category=Home+and+kitchen",
      image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?q=80&w=600&auto=format&fit=crop",
      tag: "Essentials"
    },
    {
      name: "Grocery & Essentials",
      subtitle: "Tea, Basmati Rice & Dry Fruits",
      href: "/search?category=Grocery+and+daily+essentials",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
      tag: "Daily Needs"
    },
    {
      name: "Footwear",
      subtitle: "Sneakers, Comfort Flats & Slides",
      href: "/search?category=Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      tag: "Comfort"
    },
  ];

  // Bestsellers (sorted by review count)
  const bestsellers = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  // Today's Deals (highest discount percentage)
  const deals = [...products]
    .filter(p => p.originalPrice > p.price)
    .sort((a, b) => {
      const discA = (a.originalPrice - a.price) / a.originalPrice;
      const discB = (b.originalPrice - b.price) / b.originalPrice;
      return discB - discA;
    })
    .slice(0, 4);

  // Recommended Products (featured ones)
  const recommended = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-16 overflow-hidden bg-[#FFFCF7]">
      
      {/* =========================================================================
          SECTION 3: ATTRACTIVE PROMOTIONAL HERO BANNER
          Lavender (#B9A7E8), Soft Pastel Pink (#F6DDE8), Cream-White (#FFFCF7)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F6DDE8]/40 via-[#F4EFFF] to-[#FFFCF7] pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-[#E9E1F5]">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#B9A7E8]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-[#F6DDE8]/50 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B9A7E8] bg-white px-3.5 py-1 text-xs font-bold text-[#7962B5] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#D94F70]" />
                <span className="tracking-wide">Welcome to Joan India</span>
                <span className="h-1 w-1 rounded-full bg-[#7962B5]" />
                <span className="text-[#D94F70] font-semibold">Festive Sale Live</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#292633] leading-[1.12]">
                Everyday Shopping, <br />
                <span className="text-[#7962B5] italic font-normal">Delightfully Soft & Simple.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-[#77717F] leading-relaxed font-normal">
                Discover curated women's & men's fashion, authentic skincare, everyday tech gadgets, and grocery essentials with instant quick-add convenience and honest Indian Rupee pricing.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/search"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#7962B5]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/search?category=Women%27s+fashion"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#B9A7E8] bg-white hover:bg-[#F4EFFF] text-[#7962B5] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center shadow-xs"
                >
                  Explore Women's Edit
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 text-left border-t border-[#E9E1F5]/80">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#7962B5]" />
                  <span className="text-[11px] font-semibold text-[#292633]">Free Delivery ₹499+</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#37866A]" />
                  <span className="text-[11px] font-semibold text-[#292633]">100% Genuine</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#7962B5]" />
                  <span className="text-[11px] font-semibold text-[#292633]">7-Day Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Right Featured Hero Showcase */}
            <div className="w-full lg:w-[480px] grid grid-cols-2 gap-4">
              
              {/* Highlight Card 1 */}
              <Link
                href="/products/prod_wf_1"
                className="group relative overflow-hidden rounded-2xl border border-[#E9E1F5] bg-white p-3 shadow-md hover:shadow-xl hover:border-[#B9A7E8] transition-all duration-300"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#F6DDE8]/30 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop"
                    alt="Floral Anarkali Kurta"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase text-[#7962B5] block">Fashion</span>
                <p className="text-xs font-semibold text-[#292633] truncate">Anarkali Cotton Kurta</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-bold text-[#292633]">₹899</span>
                  <span className="text-[10px] text-[#77717F] line-through">₹1,399</span>
                </div>
              </Link>

              {/* Highlight Card 2 */}
              <Link
                href="/products/prod_bp_1"
                className="group relative overflow-hidden rounded-2xl border border-[#E9E1F5] bg-white p-3 shadow-md hover:shadow-xl hover:border-[#B9A7E8] transition-all duration-300 mt-6"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#F6DDE8]/30 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
                    alt="Kashmiri Saffron Face Serum"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase text-[#7962B5] block">Skincare</span>
                <p className="text-xs font-semibold text-[#292633] truncate">Kumkumadi Saffron Serum</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-bold text-[#292633]">₹499</span>
                  <span className="text-[10px] text-[#77717F] line-through">₹799</span>
                </div>
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 4: SHOP BY CATEGORY (All 8 supported categories)
         ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#7962B5] text-xs font-bold uppercase tracking-wider mb-2">
            <Tag className="h-3.5 w-3.5 text-[#D94F70]" />
            Explore Catalog
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633]">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-[#77717F] mt-1">
            Browse our eight organized shopping departments with verified Indian prices.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl border border-[#E9E1F5] bg-white shadow-xs hover:shadow-lg hover:border-[#B9A7E8] transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFFF]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />
                <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-[#7962B5] uppercase tracking-wider shadow-xs">
                  {cat.tag}
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-[#292633] group-hover:text-[#7962B5] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#77717F] mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-[11px] font-bold text-[#7962B5] gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 5: TRENDING PRODUCTS (Interactive Tabs + Quick-Add)
         ========================================================================= */}
      <TrendingSection products={products} />


      {/* =========================================================================
          SECTION 6: BESTSELLING PRODUCTS
         ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-[#E9E1F5] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#7962B5] text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="h-3.5 w-3.5 text-[#D94F70]" />
              Most Popular
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633] tracking-tight">
              Bestselling Products
            </h2>
            <p className="text-xs sm:text-sm text-[#77717F] mt-1">
              Customer favorites with thousands of positive reviews across India.
            </p>
          </div>
          <Link
            href="/search?sort=rating_desc"
            className="text-xs font-bold text-[#7962B5] hover:text-[#654fa0] flex items-center gap-1"
          >
            <span>See Top Rated</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 7: TODAY'S DEALS AND OFFERS
         ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-[#E9E1F5] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#D94F70] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Up to 50% Off
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633] tracking-tight">
              Today's Deals and Offers
            </h2>
            <p className="text-xs sm:text-sm text-[#77717F] mt-1">
              Handpicked genuine discounts calculated honestly against valid original prices.
            </p>
          </div>
          <Link
            href="/search?sort=price_asc"
            className="text-xs font-bold text-[#7962B5] hover:text-[#654fa0] flex items-center gap-1"
          >
            <span>View All Deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Promo Coupon Card */}
        <PromoBanner />
      </section>


      {/* =========================================================================
          SECTION 8: RECOMMENDED PRODUCTS
         ========================================================================= */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-[#E9E1F5] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#7962B5] text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#37866A]" />
              Staff Pick
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633] tracking-tight">
              Recommended Products
            </h2>
            <p className="text-xs sm:text-sm text-[#77717F] mt-1">
              Curated everyday selections with top-notch durability and style.
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-[#7962B5] hover:text-[#654fa0] flex items-center gap-1"
          >
            <span>Browse Full Store</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 9: RECENTLY VIEWED PRODUCTS
         ========================================================================= */}
      <RecentlyViewed allProducts={products} />


      {/* =========================================================================
          NEWSLETTER / INSIDER CLUB
         ========================================================================= */}
      <NewsletterSection />

    </div>
  );
}
