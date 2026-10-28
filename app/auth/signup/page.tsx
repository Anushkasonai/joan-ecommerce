'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { signupAction } from '@/lib/actions/authActions';

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signupAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-[#FFFCF7] relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-80 w-80 rounded-full bg-[#B9A7E8]/20 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#F6DDE8]/40 blur-3xl" />

      <div className="max-w-md w-full bg-white border border-[#E9E1F5] rounded-3xl p-8 shadow-md relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-[#B9A7E8] to-[#7962B5] flex items-center justify-center shadow-md shadow-[#7962B5]/20">
            <span className="font-serif text-2xl font-bold text-white">J</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#292633]">
              Joan
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#292633]">Create Your Account</h2>
          <p className="text-xs text-[#77717F]">Join Joan to start shopping with quick delivery across India.</p>
        </div>

        {state?.error && (
          <div className="bg-[#F6DDE8]/50 border border-[#F6DDE8] text-[#D94F70] p-3.5 rounded-2xl text-xs font-semibold">
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#77717F] uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 pl-10 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5] focus:ring-2 focus:ring-[#B9A7E8]/30"
              />
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[#7962B5]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#77717F] uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 pl-10 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5] focus:ring-2 focus:ring-[#B9A7E8]/30"
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#7962B5]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#77717F] uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 pl-10 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5] focus:ring-2 focus:ring-[#B9A7E8]/30"
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#7962B5]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-full bg-[#7962B5] hover:bg-[#654fa0] font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-[#7962B5]/25 hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-[#77717F]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#7962B5] font-bold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
