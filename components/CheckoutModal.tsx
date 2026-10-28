'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, Lock, CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';
import { simulatePaymentAction } from '@/lib/actions/checkoutActions';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/currency';

interface CheckoutModalProps {
  orderId: string;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
}

type PaymentStep = 'select' | 'card_form' | 'upi_qr' | 'otp' | 'processing' | 'success' | 'failed';
type PaymentMethod = 'card' | 'upi';

export default function CheckoutModal({ orderId, amount, isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<PaymentStep>('select');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardError, setCardError] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Timer state for UPI QR
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'upi_qr' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const submitCardDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setCardError('Enter a valid 16-digit card number');
      return;
    }
    if (cardExpiry.length !== 5) {
      setCardError('Enter expiry as MM/YY');
      return;
    }
    if (cardCvv.length !== 3) {
      setCardError('Enter a 3-digit CVV');
      return;
    }
    if (!cardName.trim()) {
      setCardError('Enter cardholder name');
      return;
    }
    setCardError('');
    setStep('otp');
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456' && otp !== '000000') {
      setOtpError('Invalid OTP. Enter 123456 for success or 000000 for test decline.');
      return;
    }

    setOtpError('');
    setStep('processing');

    setTimeout(async () => {
      if (otp === '123456') {
        const paymentId = 'pay_' + Math.random().toString(36).substring(2, 11);
        const signature = Math.random().toString(36).substring(2, 15);
        
        const res = await simulatePaymentAction(orderId, {
          razorpayOrderId: 'order_' + orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature
        });

        if (res.success) {
          setStep('success');
        } else {
          setStep('failed');
        }
      } else {
        setStep('failed');
      }
    }, 1800);
  };

  const selectUpi = () => {
    setPaymentMethod('upi');
    setStep('upi_qr');
  };

  const selectCard = () => {
    setPaymentMethod('card');
    setStep('card_form');
  };

  const simulateSuccessUpi = async () => {
    setStep('processing');
    setTimeout(async () => {
      const paymentId = 'pay_upi_' + Math.random().toString(36).substring(2, 11);
      const signature = Math.random().toString(36).substring(2, 15);
      
      const res = await simulatePaymentAction(orderId, {
        razorpayOrderId: 'order_' + orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature
      });

      if (res.success) {
        setStep('success');
      } else {
        setStep('failed');
      }
    }, 1800);
  };

  const closeAndRedirect = () => {
    onClose();
    router.push('/orders');
    router.refresh();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E9E1F5] bg-white shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#F4EFFF] border-b border-[#E9E1F5] px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#7962B5] font-bold">Simulated Secure Gateway</span>
            <span className="text-sm font-bold text-[#292633]">Joan Payment Desk</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#77717F] block">Payable</span>
            <span className="text-base font-bold text-[#7962B5]">{formatINR(amount)}</span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6">
          
          {/* STEP: SELECT PAYMENT METHOD */}
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-[#77717F] uppercase tracking-wider mb-2">Select Online Method</p>
              
              <button
                onClick={selectUpi}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#E9E1F5] bg-[#FFFCF7] hover:bg-[#F4EFFF] hover:border-[#B9A7E8] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#F6DDE8] text-[#7962B5]">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#292633] text-sm">UPI QR Code / App</p>
                    <p className="text-xs text-[#77717F] mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#77717F] group-hover:text-[#7962B5] group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={selectCard}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#E9E1F5] bg-[#FFFCF7] hover:bg-[#F4EFFF] hover:border-[#B9A7E8] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#F4EFFF] text-[#7962B5]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#292633] text-sm">Debit / Credit Card</p>
                    <p className="text-xs text-[#77717F] mt-0.5">RuPay, Visa, Mastercard</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#77717F] group-hover:text-[#7962B5] group-hover:translate-x-1 transition-all" />
              </button>

              <div className="flex items-center justify-center gap-1.5 pt-3 text-[11px] text-[#77717F]">
                <Lock className="h-3 w-3 text-[#37866A]" />
                <span>256-Bit Encrypted Simulated Transaction</span>
              </div>
            </div>
          )}

          {/* STEP: CARD DETAILS FORM */}
          {step === 'card_form' && (
            <form onSubmit={submitCardDetails} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Card Details</span>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="text-xs text-[#7962B5] font-semibold hover:underline"
                >
                  Change Method
                </button>
              </div>

              {cardError && <p className="text-xs text-[#D94F70] bg-[#F6DDE8]/50 border border-[#F6DDE8] p-2.5 rounded-xl">{cardError}</p>}

              <div>
                <label className="block text-xs font-medium text-[#77717F] mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 1234 5678"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#77717F] mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#77717F] mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#77717F] mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-2.5 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-xs"
              >
                Proceed to Verification
              </button>
            </form>
          )}

          {/* STEP: OTP SCREEN */}
          {step === 'otp' && (
            <form onSubmit={submitOtp} className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider block mb-1">Enter Bank OTP</span>
                <p className="text-xs text-[#77717F]">A simulated 6-digit OTP has been sent to your registered mobile number.</p>
              </div>

              {otpError && <p className="text-xs text-[#D94F70] bg-[#F6DDE8]/50 border border-[#F6DDE8] p-2.5 rounded-xl text-center">{otpError}</p>}

              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest text-[#292633] focus:outline-none focus:border-[#7962B5]"
              />

              <div className="bg-[#F4EFFF] p-3 rounded-xl border border-[#E9E1F5] text-xs text-[#77717F] space-y-1">
                <p className="font-bold text-[#7962B5]">Testing Guide:</p>
                <p>• Enter <span className="text-[#37866A] font-bold">123456</span> to authorize payment successfully.</p>
                <p>• Enter <span className="text-[#D94F70] font-bold">000000</span> to simulate a bank decline.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#37866A] hover:bg-[#2d6e57] font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-xs"
              >
                Authorize Payment
              </button>
            </form>
          )}

          {/* STEP: UPI QR CODE */}
          {step === 'upi_qr' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Scan UPI QR</span>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="text-xs text-[#7962B5] font-semibold hover:underline"
                >
                  Change Method
                </button>
              </div>

              <div className="mx-auto w-44 h-44 bg-white p-3 rounded-2xl flex items-center justify-center shadow-md relative border border-[#E9E1F5]">
                <div className="w-full h-full border-2 border-dashed border-[#B9A7E8] rounded-xl flex flex-col items-center justify-center bg-[#FFFCF7]">
                  <QrCode className="h-16 w-16 text-[#7962B5]" />
                  <span className="text-[10px] font-bold text-[#7962B5] uppercase tracking-wider mt-1">Joan UPI</span>
                </div>
              </div>

              <div className="text-xs text-[#77717F]">
                <p>Scan using Google Pay, PhonePe, Paytm, or BHIM UPI</p>
                <p className="mt-1 text-[#7962B5] font-bold font-mono">
                  QR Expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </p>
              </div>

              <div className="border-t border-[#E9E1F5] pt-3">
                <button
                  onClick={simulateSuccessUpi}
                  className="w-full py-3 rounded-full bg-[#37866A] hover:bg-[#2d6e57] font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-xs"
                >
                  Simulate Successful UPI Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP: PROCESSING ANIMATION */}
          {step === 'processing' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="h-10 w-10 text-[#7962B5] animate-spin" />
              <div>
                <p className="font-bold text-[#292633] text-sm">Authorizing Payment...</p>
                <p className="text-xs text-[#77717F] mt-0.5">Communicating securely with issuing bank.</p>
              </div>
            </div>
          )}

          {/* STEP: SUCCESS */}
          {step === 'success' && (
            <div className="py-4 flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle2 className="h-14 w-14 text-[#37866A]" />
              <div>
                <h3 className="text-base font-bold text-[#292633]">Payment Successful!</h3>
                <p className="text-xs text-[#77717F] mt-0.5">Your order has been confirmed and placed with Joan.</p>
              </div>
              <div className="w-full bg-[#FFFCF7] p-3.5 rounded-2xl border border-[#E9E1F5] text-left text-xs text-[#77717F] space-y-1">
                <p><span className="text-[#292633] font-semibold">Order ID:</span> {orderId}</p>
                <p><span className="text-[#292633] font-semibold">Payment Status:</span> <strong className="text-[#37866A]">PAID & CONFIRMED</strong></p>
                <p><span className="text-[#292633] font-semibold">Amount Paid:</span> {formatINR(amount)}</p>
              </div>
              <button
                onClick={closeAndRedirect}
                className="w-full py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-xs"
              >
                View Order History
              </button>
            </div>
          )}

          {/* STEP: FAILED */}
          {step === 'failed' && (
            <div className="py-4 flex flex-col items-center justify-center text-center space-y-4">
              <XCircle className="h-14 w-14 text-[#D94F70]" />
              <div>
                <h3 className="text-base font-bold text-[#292633]">Payment Declined</h3>
                <p className="text-xs text-[#77717F] mt-0.5">The test bank verification did not succeed.</p>
              </div>
              <button
                onClick={() => setStep('select')}
                className="w-full py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] font-bold text-xs uppercase tracking-wider text-white transition-colors"
              >
                Try Payment Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
