'use client';

import React, { useState, useTransition } from 'react';
import { Star, MessageSquareCode } from 'lucide-react';
import { addReviewAction } from '@/lib/actions/adminActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReviewFormProps {
  productId: string;
  isLoggedIn: boolean;
}

export default function ReviewForm({ productId, isLoggedIn }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a review comment.');
      return;
    }

    setError('');
    setSuccess(false);

    startTransition(async () => {
      const res = await addReviewAction(productId, rating, comment);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setComment('');
        setRating(5);
        router.refresh();
      }
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="border border-[#E9E1F5] bg-white p-6 rounded-2xl text-center space-y-3 shadow-xs">
        <MessageSquareCode className="h-8 w-8 text-[#7962B5] mx-auto" />
        <h4 className="font-bold text-[#292633] text-sm">Have You Purchased This Item?</h4>
        <p className="text-xs text-[#77717F] max-w-sm mx-auto">
          Please log in to leave an authentic product review and rating.
        </p>
        <Link
          href="/auth/login"
          className="inline-block px-5 py-2 rounded-full border border-[#B9A7E8] bg-[#F4EFFF] hover:bg-[#7962B5] hover:text-white text-xs font-bold text-[#7962B5] uppercase tracking-wider transition-colors"
        >
          Sign in to Review
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#E9E1F5] bg-white p-6 rounded-2xl space-y-4 shadow-xs">
      <h3 className="font-bold text-[#292633] text-sm uppercase tracking-wider mb-2">Write a Review</h3>
      
      {error && <p className="text-xs text-[#D94F70] bg-[#F6DDE8]/40 border border-[#F6DDE8] p-2.5 rounded-xl">{error}</p>}
      {success && <p className="text-xs text-[#37866A] bg-[#37866A]/10 border border-[#37866A]/20 p-2.5 rounded-xl font-medium">Thank you! Your review has been published.</p>}

      {/* Star Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-[#77717F] uppercase tracking-wider">Your Rating:</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                type="button"
                key={i}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 text-amber-400 focus:outline-none"
              >
                <Star
                  className={`h-5 w-5 transition-transform ${
                    starValue <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400 scale-110' : 'text-[#E9E1F5]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Review Comment */}
      <div>
        <label className="block text-xs font-semibold text-[#77717F] uppercase tracking-wider mb-1">Your Feedback</label>
        <textarea
          rows={3}
          placeholder="What did you like about the product? Mention quality, fit, or delivery..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] placeholder-[#77717F] focus:outline-none focus:border-[#7962B5]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 rounded-full bg-[#7962B5] hover:bg-[#654fa0] font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-xs"
      >
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
