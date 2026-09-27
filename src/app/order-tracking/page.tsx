'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export default function OrderTrackingLookupPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/order-tracking/${encodeURIComponent(orderId.trim())}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Enter your Order Reference Number (e.g. SBE-2026-8912) generated at checkout to view live status.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Order Reference Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. SBE-2026-8912 or ord-001"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Track Order Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Real-time store inventory & dispatch status</span>
        </div>
      </div>

      {/* Sample quick tracking links */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/70 text-xs text-gray-600 space-y-2">
        <span className="font-bold text-gray-700 block">Sample Orders for Demo Testing:</span>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/order-tracking/ord-001"
            className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 font-mono text-[11px] text-brand-700 hover:underline"
          >
            SBE-2026-8912 (Store Pickup)
          </Link>
          <Link
            href="/order-tracking/ord-002"
            className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 font-mono text-[11px] text-brand-700 hover:underline"
          >
            SBE-2026-8913 (Home Delivery)
          </Link>
        </div>
      </div>
    </div>
  );
}
