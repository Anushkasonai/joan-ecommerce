'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('JOAN20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#E9E1F5] bg-gradient-to-r from-[#F6DDE8] via-[#F4EFFF] to-[#FFFCF7] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E9E1F5] text-[#7962B5] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#D94F70]" />
            Limited Period Festive Offer
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#292633]">
            Flat 20% Off On Orders Above ₹999
          </h3>
          <p className="text-xs sm:text-sm text-[#77717F] max-w-lg">
            Use the coupon code below during checkout to save an additional 20% across all fashion, beauty, electronics, and home essentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-dashed border-[#B9A7E8] shadow-xs">
            <Tag className="h-4 w-4 text-[#7962B5]" />
            <span className="font-mono font-extrabold text-sm tracking-wider text-[#7962B5]">
              JOAN20
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 p-1 text-[#77717F] hover:text-[#7962B5] transition-colors"
              title="Copy Coupon"
            >
              {copied ? <Check className="h-4 w-4 text-[#37866A]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <Link
            href="/search"
            className="px-6 py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
            <span>Shop Deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

