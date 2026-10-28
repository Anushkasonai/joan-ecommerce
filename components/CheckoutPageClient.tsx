'use client';

import React, { useState, useTransition } from 'react';
import { Truck, ShoppingBag, ShieldCheck, CreditCard, Banknote, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createOrderAction } from '@/lib/actions/checkoutActions';
import CheckoutModal from '@/components/CheckoutModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/currency';
import { useCart } from './CartContext';

interface CheckoutPageClientProps {
  cartItems: {
    productId: string;
    quantity: number;
    product: {
      name: string;
      price: number;
      image: string;
    };
  }[];
  appliedPromo: string | null;
}

export default function CheckoutPageClient({ cartItems, appliedPromo }: CheckoutPageClientProps) {
  const router = useRouter();
  const { removeFromCart } = useCart();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('400001');
  const [paymentOption, setPaymentOption] = useState<'cod' | 'online'>('cod');
  
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  // Payment modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState('');
  const [activeOrderAmount, setActiveOrderAmount] = useState(0);

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 
    'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 
    'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const promoDiscount = appliedPromo === 'JOAN20' ? Math.round(subtotal * 0.20) : 0;
  const shippingFee = subtotal > 499 ? 0 : 49;
  const finalTotal = subtotal - promoDiscount + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      setError('Please fill in all delivery address details.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (zip.replace(/\D/g, '').length < 6) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setError('');

    startTransition(async () => {
      const address = { name, phone, street, city, state, zip };
      const methodLabel = paymentOption === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (UPI/Card)';
      
      const res = await createOrderAction(address, methodLabel);
      
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.orderId) {
        // Clear local cart items
        cartItems.forEach(i => removeFromCart(i.productId));

        if (paymentOption === 'cod') {
          // COD order complete directly
          router.push('/orders');
          router.refresh();
        } else {
          // Online payment simulation modal
          setActiveOrderId(res.orderId);
          setActiveOrderAmount(finalTotal);
          setIsModalOpen(true);
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Checkout Form - Left */}
      <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
        
        {/* Address Form Card */}
        <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#292633] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Truck className="h-4.5 w-4.5 text-[#7962B5]" />
            Delivery Address
          </h2>

          {error && (
            <p className="text-xs text-[#D94F70] bg-[#F6DDE8]/50 border border-[#F6DDE8] p-3 rounded-xl font-medium">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#77717F] uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#77717F] uppercase tracking-wider mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#77717F] uppercase tracking-wider mb-1">Flat, House no., Building, Street</label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Lotus Residency, Link Road"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#77717F] uppercase tracking-wider mb-1">City / Town</label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#77717F] uppercase tracking-wider mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#77717F] uppercase tracking-wider mb-1">PIN Code</label>
              <input
                type="text"
                placeholder="6-digit PIN"
                value={zip}
                maxLength={6}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#292633] uppercase tracking-wider mb-2 flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-[#7962B5]" />
            Choose Payment Method
          </h2>

          <div className="space-y-3">
            {/* Cash on Delivery option */}
            <label
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentOption === 'cod'
                  ? 'border-[#7962B5] bg-[#F4EFFF]/60 shadow-xs'
                  : 'border-[#E9E1F5] bg-[#FFFCF7] hover:border-[#B9A7E8]'
              }`}
            >
              <input
                type="radio"
                name="paymentOption"
                checked={paymentOption === 'cod'}
                onChange={() => setPaymentOption('cod')}
                className="mt-1 text-[#7962B5] focus:ring-[#7962B5]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-[#7962B5]" />
                  <span className="text-xs font-bold text-[#292633]">Cash on Delivery (Pay at Doorstep)</span>
                </div>
                <p className="text-[11px] text-[#77717F] mt-0.5">
                  Pay via cash or UPI to the delivery courier when your order arrives.
                </p>
              </div>
            </label>

            {/* Online payment option */}
            <label
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentOption === 'online'
                  ? 'border-[#7962B5] bg-[#F4EFFF]/60 shadow-xs'
                  : 'border-[#E9E1F5] bg-[#FFFCF7] hover:border-[#B9A7E8]'
              }`}
            >
              <input
                type="radio"
                name="paymentOption"
                checked={paymentOption === 'online'}
                onChange={() => setPaymentOption('online')}
                className="mt-1 text-[#7962B5] focus:ring-[#7962B5]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#7962B5]" />
                  <span className="text-xs font-bold text-[#292633]">Instant Online Payment (UPI / QR / Cards)</span>
                </div>
                <p className="text-[11px] text-[#77717F] mt-0.5">
                  Simulated Razorpay gateway supporting Google Pay, PhonePe, Paytm, and Visa/RuPay cards.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#7962B5]/25 hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Processing Order...</span>
            </>
          ) : paymentOption === 'cod' ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Place Order with Cash on Delivery ({formatINR(finalTotal)})</span>
            </>
          ) : (
            <>
              <span>Proceed to Payment ({formatINR(finalTotal)})</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Cart Review Summary - Right */}
      <div className="lg:col-span-5 space-y-4">
        <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9E1F5] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#292633]">Order Items</h3>
            <Link href="/cart" className="text-xs font-bold text-[#7962B5] hover:underline">
              Edit Cart
            </Link>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 py-1">
                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-[#E9E1F5] bg-[#FFFCF7]">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#292633] truncate">{item.product.name}</p>
                  <p className="text-[11px] text-[#77717F]">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-[#292633] shrink-0">
                  {formatINR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-[#E9E1F5]" />

          {/* Pricing breakdown */}
          <div className="space-y-2 text-xs text-[#77717F]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#292633]">{formatINR(subtotal)}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#37866A]">
                <span>Coupon Discount (JOAN20)</span>
                <span className="font-semibold">-{formatINR(promoDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className={`font-semibold ${shippingFee === 0 ? 'text-[#37866A]' : 'text-[#292633]'}`}>
                {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
              </span>
            </div>
          </div>

          <hr className="border-[#E9E1F5]" />

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-[#292633]">Total Payable</span>
            <span className="text-xl font-bold text-[#7962B5]">{formatINR(finalTotal)}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#77717F] pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#37866A]" />
            <span>Guaranteed Secure Order Processing</span>
          </div>
        </div>
      </div>

      {/* Online Payment Modal */}
      <CheckoutModal
        orderId={activeOrderId}
        amount={activeOrderAmount}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
