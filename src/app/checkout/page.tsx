'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  Truck,
  ShieldCheck,
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  QrCode,
  Banknote,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';
import { DeliveryMethod } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalItems, mrpTotal, subtotal, festivalDiscountAmount, clearCart } = useCart();
  const { settings } = useStore();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('home_delivery');

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Delivery Fields
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState(settings.city || 'Kolkata');
  const [pincode, setPincode] = useState(settings.pincode || '700001');
  const [instructions, setInstructions] = useState('');

  // Store Pickup Fields
  const [pickupTime, setPickupTime] = useState('Today within store hours');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'pay_at_store' | 'upi_on_delivery'>('cod');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const isFreeDelivery = subtotal >= settings.freeDeliveryAbove;
  const deliveryFee = deliveryMethod === 'store_pickup' ? 0 : isFreeDelivery ? 0 : settings.deliveryFee;
  const finalPayable = subtotal - festivalDiscountAmount + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for order verification');
      return;
    }

    if (deliveryMethod === 'home_delivery') {
      if (!address.trim()) {
        setErrorMsg('Please enter your complete delivery street address');
        return;
      }
      if (!pincode.trim()) {
        setErrorMsg('Please enter your 6-digit delivery PIN code');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        deliveryMethod,
        deliveryAddress:
          deliveryMethod === 'home_delivery'
            ? {
                address: address.trim(),
                area: area.trim(),
                city: city.trim(),
                pincode: pincode.trim(),
                instructions: instructions.trim(),
              }
            : undefined,
        pickupDetails:
          deliveryMethod === 'store_pickup'
            ? {
                storeName: settings.storeName,
                storeAddress: `${settings.address}, ${settings.city} - ${settings.pincode}`,
                pickupTime,
              }
            : undefined,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          mrp: item.product.mrp,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
        mrpTotal,
        subtotal,
        festivalDiscountAmount,
        deliveryFee,
        totalAmount: finalPayable,
        paymentMethod: deliveryMethod === 'store_pickup' ? 'pay_at_store' : paymentMethod,
        notes: instructions.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const createdOrder = await res.json();
      clearCart();
      router.push(`/order-tracking/${createdOrder.id}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMsg(err.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Select whether you want local doorstep delivery or fast showroom store pickup.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left 2 Columns: Information and Delivery Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Fulfillment Mode Switch */}
          <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Choose Delivery Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Home Delivery Card */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'home_delivery'
                    ? 'border-brand-600 bg-orange-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">Home Delivery</h4>
                      <p className="text-[11px] text-gray-500">Delivered to your address</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'home_delivery'}
                    onChange={() => {
                      setDeliveryMethod('home_delivery');
                      setPaymentMethod('cod');
                    }}
                    className="accent-brand-600 w-4 h-4 mt-1"
                  />
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <span className="font-bold text-gray-900">
                    {isFreeDelivery ? 'FREE' : formatINR(settings.deliveryFee)}
                  </span>
                </div>
              </label>

              {/* Buy From Store Pickup Card */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'store_pickup'
                    ? 'border-brand-600 bg-orange-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Buy From Store / Store Pickup
                      </h4>
                      <p className="text-[11px] text-gray-500">Pick up at showroom</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'store_pickup'}
                    onChange={() => {
                      setDeliveryMethod('store_pickup');
                      setPaymentMethod('pay_at_store');
                    }}
                    className="accent-brand-600 w-4 h-4 mt-1"
                  />
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <span className="font-bold text-emerald-700">100% FREE</span>
                </div>
              </label>
            </div>

            {/* Store Pickup Physical Showroom Details Callout */}
            {deliveryMethod === 'store_pickup' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2 text-amber-950">
                <div className="font-bold text-sm flex items-center gap-1.5 text-amber-900">
                  <Store className="w-4 h-4" />
                  <span>Showroom Pickup Address</span>
                </div>
                <p className="text-xs text-gray-700">
                  <strong>{settings.storeName}</strong>
                  <br />
                  {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Timings: {settings.openingHours}</span>
                </div>
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    When do you plan to collect your order?
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full sm:w-auto p-2 bg-white border border-amber-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Today within 2 hours">Today within 2 hours</option>
                    <option value="Today evening (5 PM - 9 PM)">Today evening (5 PM - 9 PM)</option>
                    <option value="Tomorrow morning (11 AM - 2 PM)">Tomorrow morning (11 AM - 2 PM)</option>
                    <option value="Tomorrow evening">Tomorrow evening</option>
                    <option value="This weekend">This weekend</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 2. Customer Information */}
          <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sourav Ganguly"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Mobile Number (Calling & WhatsApp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-11 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">
                  Email Address (Optional for Invoice)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Address (Only if Home Delivery) */}
          {deliveryMethod === 'home_delivery' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Delivery Address</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Flat / House No. / Building / Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 3A, Joy Apartment, 14 Lake Road, Landmark: Near SBI Bank"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Area / Locality</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Salt Lake / Garia"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">PIN Code <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="700001"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Special Delivery Instructions</label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Please deliver between 2 PM - 6 PM; lift is working."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Payment Options */}
          <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                {deliveryMethod === 'home_delivery' ? '4' : '3'}
              </span>
              <span>Payment Option</span>
            </h2>

            <div className="space-y-2.5 text-xs">
              {deliveryMethod === 'store_pickup' ? (
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Pay at Store Counter (Cash, UPI or Card)</h4>
                    <p className="text-[11px] text-gray-500">
                      Reserve online today with zero advance. Inspect your product thoroughly at the store before making payment.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-brand-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500">Pay cash upon receiving products</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi_on_delivery"
                      checked={paymentMethod === 'upi_on_delivery'}
                      onChange={() => setPaymentMethod('upi_on_delivery')}
                      className="accent-brand-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">UPI on Delivery (Scan QR / GPay / PhonePe)</span>
                      <span className="text-[11px] text-gray-500">Scan delivery executive&apos;s UPI QR code at your door</span>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-gray-900 tracking-tight pb-3 border-b border-gray-100">
            Order Review ({totalItems} Items)
          </h2>

          {/* Quick Item List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                <div className="flex-1 min-w-0 pr-2">
                  <span className="font-semibold text-gray-900 truncate block">{product.name}</span>
                  <span className="text-[11px] text-gray-500">Qty: {quantity}</span>
                </div>
                <span className="font-bold text-gray-900 shrink-0">
                  {formatINR(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
            </div>

            {festivalDiscountAmount > 0 && (
              <div className="flex justify-between text-festive-red font-semibold">
                <span>Festival Discount</span>
                <span>- {formatINR(festivalDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Fulfillment Fee</span>
              <span className="font-semibold text-gray-900">
                {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : formatINR(deliveryFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-black text-gray-900">
              <span>Grand Total</span>
              <span className="text-brand-700">{formatINR(finalPayable)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-lg shadow-brand-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>
                  {deliveryMethod === 'store_pickup' ? 'Confirm Store Reservation' : 'Place Order Now'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-500">
            By placing this order, you agree to verified local fulfillment with official GST bill and warranty.
          </p>
        </div>
      </form>
    </div>
  );
}
