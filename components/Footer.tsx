import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Truck, RotateCcw, Headphones, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFFCF7] border-t border-[#E9E1F5] text-[#292633] text-sm mt-auto relative overflow-hidden">
      
      {/* 4 Trust Pillars Bar */}
      <div className="border-b border-[#E9E1F5] bg-gradient-to-r from-[#F4EFFF]/60 via-white to-[#F6DDE8]/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#F4EFFF] rounded-2xl border border-[#E9E1F5] text-[#7962B5] shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#292633]">Pan-India Free Shipping</h4>
              <p className="text-xs text-[#77717F] mt-0.5 leading-relaxed">
                Free standard delivery across 19,000+ Indian pincodes on orders over ₹499.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#F4EFFF] rounded-2xl border border-[#E9E1F5] text-[#7962B5] shadow-xs">
              <ShieldCheck className="h-5 w-5 text-[#37866A]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#292633]">100% Genuine Products</h4>
              <p className="text-xs text-[#77717F] mt-0.5 leading-relaxed">
                Directly sourced from verified manufacturers, authentic brands, and weavers.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#F4EFFF] rounded-2xl border border-[#E9E1F5] text-[#7962B5] shadow-xs">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#292633]">7-Day Easy Returns</h4>
              <p className="text-xs text-[#77717F] mt-0.5 leading-relaxed">
                Hassle-free doorstep pickup and instant refund initiation on return orders.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="p-2.5 bg-[#F4EFFF] rounded-2xl border border-[#E9E1F5] text-[#7962B5] shadow-xs">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#292633]">Dedicated Support</h4>
              <p className="text-xs text-[#77717F] mt-0.5 leading-relaxed">
                Live customer assistance available Monday through Sunday, 9 AM – 9 PM IST.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[#B9A7E8] to-[#7962B5] flex items-center justify-center shadow-xs">
              <span className="font-serif text-lg font-bold text-white">J</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#292633]">
              Joan
            </span>
          </Link>

          <p className="text-xs leading-relaxed text-[#77717F] max-w-sm pt-1">
            Joan is India's soft, modern e-commerce marketplace combining curated fashion, honest everyday Indian pricing, and the speed of quick-add shopping.
          </p>

          <div className="pt-2 flex items-center gap-1.5 text-xs text-[#7962B5] font-semibold">
            <Sparkles className="h-4 w-4 text-[#D94F70]" />
            <span>Built with care for Indian shoppers</span>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292633] mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-xs text-[#77717F]">
            <li>
              <Link href="/search?category=Women%27s+fashion" className="hover:text-[#7962B5] transition-colors">
                Women's Fashion
              </Link>
            </li>
            <li>
              <Link href="/search?category=Men%27s+fashion" className="hover:text-[#7962B5] transition-colors">
                Men's Fashion
              </Link>
            </li>
            <li>
              <Link href="/search?category=Bags+and+accessories" className="hover:text-[#7962B5] transition-colors">
                Bags & Accessories
              </Link>
            </li>
            <li>
              <Link href="/search?category=Beauty+and+personal+care" className="hover:text-[#7962B5] transition-colors">
                Beauty & Personal Care
              </Link>
            </li>
            <li>
              <Link href="/search?category=Electronics+and+mobile+accessories" className="hover:text-[#7962B5] transition-colors">
                Electronics & Accessories
              </Link>
            </li>
            <li>
              <Link href="/search?category=Home+and+kitchen" className="hover:text-[#7962B5] transition-colors">
                Home & Kitchen
              </Link>
            </li>
            <li>
              <Link href="/search?category=Grocery+and+daily+essentials" className="hover:text-[#7962B5] transition-colors">
                Grocery & Essentials
              </Link>
            </li>
            <li>
              <Link href="/search?category=Footwear" className="hover:text-[#7962B5] transition-colors">
                Footwear
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service & Policies */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292633] mb-4">
            Customer Policies
          </h3>
          <ul className="space-y-2 text-xs text-[#77717F]">
            <li>
              <Link href="/orders" className="hover:text-[#7962B5] transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-[#7962B5] transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-[#7962B5] transition-colors">
                Wishlist
              </Link>
            </li>
            <li>
              <span className="cursor-default">Shipping Policy</span>
            </li>
            <li>
              <span className="cursor-default">Returns & Refunds</span>
            </li>
            <li>
              <span className="cursor-default">Privacy Policy</span>
            </li>
            <li>
              <span className="cursor-default">Terms & Conditions</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#292633] mb-4">
            Contact Us
          </h3>
          <ul className="space-y-2 text-xs text-[#77717F]">
            <li className="font-semibold text-[#292633]">
              Joan India Headquarters
            </li>
            <li>
              Sector 62, Noida, NCR Delhi 201301
            </li>
            <li className="pt-1">
              Helpline: <span className="font-bold text-[#292633]">1800-200-5626</span>
            </li>
            <li>
              Email: <span className="text-[#7962B5] font-semibold">support@joan.com</span>
            </li>
            <li className="text-[11px] text-[#77717F] pt-1">
              Mon – Sun: 9:00 AM – 9:00 PM IST
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#E9E1F5] bg-[#F4EFFF]/40 py-5 text-xs text-[#77717F]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Joan Retail India Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#E9E1F5] text-[#7962B5]">
              RuPay & UPI Enabled
            </span>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#E9E1F5] text-[#37866A]">
              100% Secure Checkout
            </span>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#E9E1F5] text-[#292633]">
              Made with Pride in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
