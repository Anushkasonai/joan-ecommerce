'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-[#E9E1F5] bg-gradient-to-br from-[#F4EFFF] via-white to-[#F6DDE8]/40 p-8 sm:p-12 lg:p-16 text-center shadow-[0_8px_30px_rgba(121,98,181,0.06)]">
        {/* Subtle decorative glows */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#B9A7E8]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#F6DDE8]/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6DDE8] text-[#7962B5] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#D94F70]" />
            Joan Insider Club
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292633] tracking-tight">
            Get 20% Off Your First Order
          </h2>

          <p className="text-xs sm:text-sm text-[#77717F] leading-relaxed max-w-lg mx-auto">
            Subscribe to receive insider access to new arrivals, flash deals, seasonal sales, and instant coupon codes straight to your inbox.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#37866A] text-white text-xs font-semibold shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>You're in! Use coupon code <strong>JOAN20</strong> at checkout for 20% off.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto pt-2">
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#E9E1F5] rounded-full px-5 py-3 pl-11 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5] focus:ring-2 focus:ring-[#B9A7E8]/30 shadow-xs"
                />
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#7962B5]" />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#77717F] pt-1">
            Zero spam. Unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
}
