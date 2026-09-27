'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';
import { SafeImage } from '@/components/SafeImage';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    mrpTotal,
    subtotal,
    festivalDiscountAmount,
    savingsTotal,
  } = useCart();

  const { settings, campaign } = useStore();

  const isFreeDelivery = subtotal >= settings.freeDeliveryAbove;
  const estimatedDeliveryFee = isFreeDelivery ? 0 : settings.deliveryFee;
  const finalTotal = subtotal - festivalDiscountAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Explore our Durga Puja festival offers across smartphones, TVs, appliances, and electrical accessories.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Festival Pricing Active</span>
          </span>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-xs flex gap-3 sm:gap-4 items-center"
            >
              {/* Product Thumbnail */}
              <Link
                href={`/product/${product.id}`}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl p-2 shrink-0 border border-gray-100 block"
              >
                <SafeImage
                  src={product.images[0]}
                  alt={product.name}
                  brand={product.brand}
                  className="w-full h-full object-contain"
                />
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {product.brand}
                </span>
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Price block */}
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm sm:text-base font-black text-gray-900">
                    {formatINR(product.price)}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-[11px] text-gray-400 line-through">
                      MRP {formatINR(product.mrp)}
                    </span>
                  )}
                </div>

                {/* Mobile controls & Quantity Selector */}
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 sm:p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 sm:p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Fulfillment Modes Preview Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-600 shrink-0" />
              <span>
                <strong>Store Pickup Option:</strong> Free in-store pickup available at {settings.storeName}. You can choose pickup or home delivery at checkout.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Price Breakdown */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-gray-900 tracking-tight pb-3 border-b border-gray-100">
            Price Details ({totalItems} Items)
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Total MRP</span>
              <span className="font-semibold text-gray-900">{formatINR(mrpTotal)}</span>
            </div>

            <div className="flex justify-between text-emerald-700">
              <span>Retail Catalog Discount</span>
              <span className="font-semibold">- {formatINR(mrpTotal - subtotal)}</span>
            </div>

            {festivalDiscountAmount > 0 && (
              <div className="flex justify-between text-festive-red font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Durga Puja Savings</span>
                </span>
                <span>- {formatINR(festivalDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold">
                {isFreeDelivery ? (
                  <span className="text-emerald-700">FREE</span>
                ) : (
                  formatINR(settings.deliveryFee)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-sm sm:text-base font-black text-gray-900">
              <span>Total Payable Amount</span>
              <span className="text-brand-700">{formatINR(finalTotal)}</span>
            </div>
          </div>

          {/* Savings Highlight Box */}
          {savingsTotal > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
              🎉 You will save {formatINR(savingsTotal)} on this festival order!
            </div>
          )}

          {/* Checkout CTA */}
          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safe & Verified Local Ordering</span>
          </div>
        </div>
      </div>
    </div>
  );
}
