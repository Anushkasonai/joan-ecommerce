import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getOrdersByUserId } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatINR } from '@/lib/currency';

export const dynamic = 'force-dynamic';

const STAGES = [
  { key: 'ordered', label: 'Ordered' },
  { key: 'paid', label: 'Paid' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' }
];

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get orders sorted by date descending
  const orders = getOrdersByUserId(user.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStageIndex = (status: string) => {
    return STAGES.findIndex(stage => stage.key === status);
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-[#E9E1F5] pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#292633]">Your Orders</h1>
        <p className="text-xs text-[#77717F] mt-1">Track delivery status and view itemized invoices.</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStageIdx = getStageIndex(order.orderStatus);
            const isCancelled = order.orderStatus === 'cancelled';
            
            return (
              <div
                key={order.id}
                className="border border-[#E9E1F5] bg-white rounded-3xl overflow-hidden shadow-xs hover:border-[#B9A7E8] transition-all"
              >
                {/* Order Summary Ribbon */}
                <div className="bg-[#F4EFFF]/70 border-b border-[#E9E1F5] px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#77717F] block uppercase font-bold text-[10px] tracking-wider">Order ID</span>
                    <span className="font-mono text-[#292633] font-bold">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[#77717F] block uppercase font-bold text-[10px] tracking-wider">Date Placed</span>
                    <span className="text-[#292633] font-medium">
                      {(() => {
                        const d = new Date(order.createdAt);
                        const day = d.getUTCDate();
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const month = months[d.getUTCMonth()];
                        const year = d.getUTCFullYear();
                        return `${day} ${month} ${year}`;
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#77717F] block uppercase font-bold text-[10px] tracking-wider">Total Amount</span>
                    <span className="text-[#7962B5] font-bold text-sm">{formatINR(order.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-[#77717F] block uppercase font-bold text-[10px] tracking-wider">Payment & Status</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                      order.paymentStatus === 'paid'
                        ? 'bg-[#37866A]/10 text-[#37866A] border border-[#37866A]/20'
                        : 'bg-[#F6DDE8] text-[#7962B5] border border-[#E9E1F5]'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Paid Securely' : 'Pay on Delivery'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Visual Tracker Timeline */}
                  {!isCancelled ? (
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#77717F] block">Shipment Status Tracker</span>
                      <div className="relative">
                        <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-[#E9E1F5]">
                          <div
                            style={{ width: `${Math.max(10, ((currentStageIdx + 1) / STAGES.length) * 100)}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#7962B5] transition-all duration-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                          {STAGES.map((stg, i) => {
                            const isPassed = i <= currentStageIdx;
                            return (
                              <div key={stg.key} className="space-y-1">
                                <div className={`mx-auto h-3 w-3 rounded-full border-2 ${
                                  isPassed ? 'bg-[#7962B5] border-[#7962B5]' : 'bg-white border-[#E9E1F5]'
                                }`} />
                                <span className={`text-[10px] block font-semibold ${
                                  isPassed ? 'text-[#292633]' : 'text-[#77717F]'
                                }`}>
                                  {stg.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#F6DDE8]/40 border border-[#F6DDE8] rounded-xl text-xs text-[#D94F70] font-semibold">
                      This order was cancelled.
                    </div>
                  )}

                  {/* Items in this order */}
                  <div className="space-y-3 border-t border-[#E9E1F5] pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#77717F] block">Items ({order.items.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFCF7] border border-[#E9E1F5]">
                          <div className="h-14 w-14 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E9E1F5]">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${item.productId}`} className="text-xs font-semibold text-[#292633] hover:text-[#7962B5] line-clamp-1">
                              {item.name}
                            </Link>
                            <p className="text-[11px] text-[#77717F] mt-0.5">
                              Qty: {item.quantity} × {formatINR(item.price)}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#292633] shrink-0">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address Details */}
                  <div className="border-t border-[#E9E1F5] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#77717F]">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#7962B5] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#292633]">Shipping to {order.deliveryAddress.name}</span>
                        <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zip}</p>
                        <p className="text-[11px]">Phone: {order.deliveryAddress.phone}</p>
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#77717F] block">Payment Method</span>
                      <span className="font-semibold text-[#292633]">{order.paymentMethod}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-[#E9E1F5] rounded-3xl shadow-xs">
          <div className="p-4 rounded-full bg-[#F4EFFF] text-[#7962B5] mb-5">
            <Package className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#292633]">No Orders Found</h2>
          <p className="text-xs text-[#77717F] mt-1.5 max-w-sm leading-relaxed">
            You haven't placed any orders with Joan yet. Browse our trending collections and place your first order!
          </p>
          <Link
            href="/search"
            className="mt-6 px-8 py-3 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-xs font-bold text-white uppercase tracking-wider transition-colors shadow-xs"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
