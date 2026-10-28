import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import AddToCartForm from '@/components/AddToCartForm';
import ReviewForm from '@/components/ReviewForm';
import ProductCard from '@/components/ProductCard';
import RecordView from '@/components/RecordView';
import { formatINR, calculateDiscount } from '@/lib/currency';
import { 
  ChevronRight, Star, StarHalf, ShieldCheck, Truck, RotateCcw, 
  MapPin, CheckCircle2, Clock, Sparkles 
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const user = await getCurrentUser();
  const discount = calculateDiscount(product.price, product.originalPrice);

  // Fetch related products in the same category
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-[#E9E1F5]" />);
      }
    }
    return stars;
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Record view for recently viewed tracking */}
      <RecordView productId={product.id} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-[#77717F] mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#7962B5]">Home</Link>
        <ChevronRight className="h-3 w-3 text-[#77717F]" />
        <Link href="/search" className="hover:text-[#7962B5]">Shop</Link>
        <ChevronRight className="h-3 w-3 text-[#77717F]" />
        <Link href={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-[#7962B5]">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 text-[#77717F]" />
        <span className="text-[#292633] font-semibold truncate max-w-[220px]">{product.name}</span>
      </nav>

      {/* Main Grid: Left Image, Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#E9E1F5] bg-white flex items-center justify-center p-4 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center rounded-2xl"
            />
            {discount > 0 && (
              <span className="absolute left-6 top-6 rounded-full bg-[#F6DDE8] border border-[#F6DDE8] px-3.5 py-1 text-xs font-bold text-[#D94F70] uppercase tracking-wider shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Info Panels */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7962B5]">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold font-serif text-[#292633] sm:text-3xl tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & reviews summary */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-sm font-bold text-[#292633]">{product.rating}</span>
              <span className="text-xs text-[#77717F]">({product.reviewCount} customer ratings)</span>
            </div>
          </div>

          <hr className="border-[#E9E1F5]" />

          {/* Price Block */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#292633]">{formatINR(product.price)}</span>
              {discount > 0 && (
                <span className="text-base text-[#77717F] line-through font-normal">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-[#D94F70] bg-[#F6DDE8] px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="text-xs text-[#77717F]">Inclusive of all applicable Indian taxes (GST).</p>
          </div>

          {/* Stock state */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#77717F] font-medium">Availability:</span>
            {product.stock > 10 ? (
              <span className="text-[#37866A] flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                In Stock & Ready to Ship
              </span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600">Only {product.stock} items left in stock</span>
            ) : (
              <span className="text-[#D94F70]">Currently Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#77717F]">About this item</h3>
            <p className="text-xs sm:text-sm text-[#292633] leading-relaxed font-normal">{product.description}</p>
          </div>

          <hr className="border-[#E9E1F5]" />

          {/* Cart & Actions Stepper */}
          <AddToCartForm productId={product.id} stock={product.stock} category={product.category} />

          {/* Delivery & Pincode Highlights */}
          <div className="border border-[#E9E1F5] bg-white rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#292633] font-semibold">
                <Truck className="h-4 w-4 text-[#7962B5]" />
                <span>Standard Delivery: <strong>2 - 4 Business Days</strong></span>
              </div>
              <span className="text-[#37866A] font-bold">Free on ₹499+</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E9E1F5] text-center">
              <div className="p-2 bg-[#FFFCF7] rounded-xl border border-[#E9E1F5]">
                <ShieldCheck className="h-4 w-4 text-[#7962B5] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#292633] block">100% Genuine</span>
              </div>
              <div className="p-2 bg-[#FFFCF7] rounded-xl border border-[#E9E1F5]">
                <RotateCcw className="h-4 w-4 text-[#7962B5] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#292633] block">7-Day Returns</span>
              </div>
              <div className="p-2 bg-[#FFFCF7] rounded-xl border border-[#E9E1F5]">
                <Sparkles className="h-4 w-4 text-[#7962B5] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-[#292633] block">Pay on Delivery</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#E9E1F5] pt-12">
        
        {/* Specs Table - Left */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#292633]">Technical Specifications</h3>
          <div className="overflow-hidden rounded-2xl border border-[#E9E1F5] bg-white shadow-xs">
            <table className="min-w-full divide-y divide-[#E9E1F5] text-xs">
              <tbody className="divide-y divide-[#E9E1F5]">
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key}>
                    <td className="px-4 py-3 font-semibold text-[#77717F] uppercase tracking-wider w-1/3 bg-[#FFFCF7]">
                      {key}
                    </td>
                    <td className="px-4 py-3 text-[#292633] font-medium">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews Section - Right */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#292633]">
            Customer Reviews ({product.reviews.length})
          </h3>

          <div className="space-y-3.5">
            {product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl border border-[#E9E1F5] bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#292633] text-xs">{rev.userName}</span>
                    <span className="text-[10px] text-[#77717F]">
                      {(() => {
                        const d = new Date(rev.createdAt);
                        const day = d.getUTCDate();
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const month = months[d.getUTCMonth()];
                        const year = d.getUTCFullYear();
                        return `${day} ${month} ${year}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center">{renderStars(rev.rating)}</div>
                  <p className="text-xs text-[#77717F] font-normal leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#77717F] italic">No reviews yet for this product. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Form to submit review */}
          <ReviewForm productId={product.id} isLoggedIn={!!user} />
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E9E1F5] pt-12 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold text-[#292633]">
              Similar Products in {product.category}
            </h3>
            <Link
              href={`/search?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-[#7962B5] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
