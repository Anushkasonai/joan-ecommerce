'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, Heart, User, Search, Menu, X, LogOut, 
  LayoutDashboard, PackageCheck, MapPin, ChevronDown, Sparkles 
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/authActions';
import { useCart } from './CartContext';

interface HeaderProps {
  user: { name: string; email: string; role: 'user' | 'admin' } | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount, wishlistCount } = useCart();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai 400001');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const savedCity = localStorage.getItem('joan_delivery_city');
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('joan_delivery_city', city);
    setIsLocationOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutAction();
    setIsProfileOpen(false);
    router.refresh();
  };

  const categories = [
    { name: "Women's Fashion", href: "/search?category=Women%27s+fashion" },
    { name: "Men's Fashion", href: "/search?category=Men%27s+fashion" },
    { name: "Bags & Accessories", href: "/search?category=Bags+and+accessories" },
    { name: "Beauty & Care", href: "/search?category=Beauty+and+personal+care" },
    { name: "Electronics", href: "/search?category=Electronics+and+mobile+accessories" },
    { name: "Home & Kitchen", href: "/search?category=Home+and+kitchen" },
    { name: "Grocery & Essentials", href: "/search?category=Grocery+and+daily+essentials" },
    { name: "Footwear", href: "/search?category=Footwear" },
  ];

  const popularCities = [
    'Mumbai 400001',
    'New Delhi 110001',
    'Bengaluru 560001',
    'Hyderabad 500001',
    'Chennai 600001',
    'Kolkata 700001',
    'Pune 411001',
    'Ahmedabad 380001',
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E9E1F5] bg-[#FFFCF7]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(121,98,181,0.06)]">
      {/* Top Promotional Announcement Bar */}
      <div className="bg-[#7962B5] text-[#FFFCF7] text-[11px] font-medium tracking-wide py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[#F6DDE8]" />
        <span>Welcome to <strong>Joan</strong> • Free Express Delivery across India on orders above ₹499 • Use code <strong>JOAN20</strong> for 20% off!</span>
        <Sparkles className="h-3.5 w-3.5 text-[#F6DDE8]" />
      </div>

      {/* Main Header Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Delivery Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#B9A7E8] to-[#7962B5] flex items-center justify-center shadow-md shadow-[#7962B5]/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-serif text-xl font-bold tracking-tight text-white">J</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#292633] leading-none">
                Joan
              </span>
              <span className="text-[9px] tracking-[0.2em] font-semibold uppercase text-[#7962B5] mt-0.5">
                Modern Shopping
              </span>
            </div>
          </Link>

          {/* Delivery Location Selector - Desktop */}
          <div className="hidden lg:block relative" ref={locationRef}>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9E1F5] bg-white hover:border-[#B9A7E8] hover:bg-[#F4EFFF]/50 transition-all text-left text-xs"
              title="Change Delivery Location"
            >
              <MapPin className="h-4 w-4 text-[#7962B5] shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-[#77717F] font-medium">Deliver to</span>
                <span className="font-bold text-[#292633] truncate max-w-[120px]">{selectedCity}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-[#77717F] ml-1" />
            </button>

            {isLocationOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-[#E9E1F5] bg-white p-3 shadow-xl z-50">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#77717F] mb-2 px-1">
                  Choose Delivery City
                </p>
                <div className="space-y-1">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCity === city
                          ? 'bg-[#F4EFFF] text-[#7962B5] font-bold'
                          : 'text-[#292633] hover:bg-[#FFFCF7]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Large Search Bar (Amazon Style) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-2 relative">
          <input
            type="text"
            placeholder="Search fashion, beauty, electronics, home essentials, groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E9E1F5] rounded-full px-5 py-2.5 pl-11 pr-24 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5] focus:ring-2 focus:ring-[#B9A7E8]/30 transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-3 h-4 w-4 text-[#7962B5]" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#7962B5] hover:bg-[#654fa0] text-white rounded-full text-xs font-semibold transition-all shadow-sm flex items-center justify-center"
          >
            Search
          </button>
        </form>

        {/* Right: Actions (Wishlist, Cart, Profile) */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Wishlist Button */}
          <Link
            href="/wishlist"
            className="relative p-2.5 text-[#292633] hover:text-[#7962B5] transition-colors rounded-xl hover:bg-[#F4EFFF]"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#D94F70] text-[10px] font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E9E1F5] hover:border-[#B9A7E8] hover:bg-[#F4EFFF]/50 text-[#292633] hover:text-[#7962B5] transition-all shadow-xs"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-[#7962B5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#7962B5] text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-[#292633]">
              Cart
            </span>
          </Link>

          {/* Profile / Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E9E1F5] bg-white hover:border-[#B9A7E8] transition-all text-xs text-[#292633] font-semibold shadow-xs"
              >
                <div className="h-6 w-6 rounded-full bg-[#7962B5] flex items-center justify-center text-[11px] text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate hidden sm:inline-block">{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-3 w-3 text-[#77717F]" />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7962B5] hover:bg-[#654fa0] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Profile Dropdown Items */}
            {isProfileOpen && user && (
              <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-[#E9E1F5] bg-white p-2 shadow-xl z-50">
                <div className="px-3 py-2.5 border-b border-[#E9E1F5] mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#77717F] font-semibold">Account</p>
                  <p className="text-sm font-bold text-[#292633] truncate">{user.name}</p>
                  <p className="text-[11px] text-[#77717F] truncate">{user.email}</p>
                </div>
                
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#7962B5] hover:bg-[#F4EFFF] transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/orders"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#292633] hover:bg-[#F4EFFF] transition-colors"
                >
                  <PackageCheck className="h-4 w-4 text-[#77717F]" />
                  Your Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#292633] hover:text-[#7962B5] rounded-xl hover:bg-[#F4EFFF] md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

      </div>

      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search fashion, beauty, electronics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E9E1F5] rounded-full px-4 py-2 pl-10 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5]"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#7962B5]" />
        </form>
      </div>

      {/* Category Navigation Bar (All 8 categories) */}
      <div className="bg-[#FFFCF7] border-t border-[#E9E1F5] overflow-x-auto no-scrollbar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-4 sm:gap-8 min-w-max">
          <Link
            href="/search"
            className="text-xs font-bold text-[#7962B5] hover:text-[#654fa0] transition-colors py-1 flex items-center gap-1.5 shrink-0"
          >
            <span>All Products</span>
          </Link>
          <span className="text-[#E9E1F5]">|</span>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-xs font-medium text-[#292633] hover:text-[#7962B5] transition-colors py-1 relative group shrink-0"
            >
              {category.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7962B5] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9E1F5] bg-[#FFFCF7] px-5 py-5 space-y-4 shadow-lg">
          {/* Location for mobile */}
          <div className="p-3 bg-white rounded-2xl border border-[#E9E1F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#7962B5]" />
              <span className="text-xs font-semibold text-[#292633]">{selectedCity}</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="text-[11px] bg-transparent text-[#7962B5] font-bold focus:outline-none"
            >
              {popularCities.map(city => (
                <option key={city} value={city}>{city.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 py-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77717F] px-2 mb-2">Shop By Category</p>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-[#292633] hover:bg-[#F4EFFF] transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#E9E1F5] pt-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-white border border-[#E9E1F5] rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-[#7962B5] flex items-center justify-center text-xs text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#292633]">{user.name}</p>
                    <p className="text-[11px] text-[#77717F]">{user.email}</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#7962B5] hover:bg-[#F4EFFF]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#292633] hover:bg-[#F4EFFF]"
                >
                  <PackageCheck className="h-4 w-4 text-[#77717F]" />
                  Your Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7962B5] py-3 text-center text-xs font-bold text-white transition-opacity hover:opacity-95"
              >
                <User className="h-4 w-4" />
                Sign In to Joan
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
