'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Store,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { formatINR, generateWhatsAppUrl } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { SafeImage } from '@/components/SafeImage';

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const { settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error('Failed to load order:', e);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadOrder();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500">
          We could not find an order matching reference &quot;{id}&quot;. Please verify the order number.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const isStorePickup = order.deliveryMethod === 'store_pickup';

  // Stepper milestones
  const steps = isStorePickup
    ? [
        { key: 'new', label: 'Order Placed', desc: 'Received online' },
        { key: 'confirmed', label: 'Order Confirmed', desc: 'Stock allocated' },
        { key: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'At store counter' },
        { key: 'completed', label: 'Collected / Picked Up', desc: 'Completed' },
      ]
    : [
        { key: 'new', label: 'Order Placed', desc: 'Received online' },
        { key: 'confirmed', label: 'Confirmed', desc: 'Verified by shop' },
        { key: 'preparing', label: 'Packed & Dispatched', desc: 'Out from shop' },
        { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'On way to address' },
        { key: 'completed', label: 'Delivered', desc: 'Delivered successfully' },
      ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = isStorePickup
      ? ['new', 'confirmed', 'ready_for_pickup', 'completed']
      : ['new', 'confirmed', 'preparing', 'out_for_delivery', 'completed'];

    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (order.status === 'cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  const whatsappMsg = `Hello ${settings.storeName},\n\nI am checking the status of my order *${order.orderNumber}* placed under name *${order.customerName}*.\nTotal: ${formatINR(order.totalAmount)}.\n\nPlease share latest delivery / pickup update.`;
  const whatsappUrl = generateWhatsAppUrl(settings.whatsapp, whatsappMsg);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6">
      {/* 1. Header with Success & Order Reference */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Order Confirmed & Logged
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp Shop</span>
          </a>

          <a
            href={`tel:${settings.phone}`}
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-gray-200"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Shop</span>
          </a>
        </div>
      </div>

      {/* 2. Visual Milestone Stepper */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
              {isStorePickup ? <Store className="w-4 h-4 text-brand-600" /> : <Truck className="w-4 h-4 text-brand-600" />}
              <span>
                {isStorePickup ? 'Showroom Pickup Tracker' : 'Doorstep Delivery Tracker'}
              </span>
            </h2>
            <span className="text-xs text-gray-500 mt-0.5 block">
              Current Status:{' '}
              <strong className="text-brand-600 uppercase">
                {order.status.replace(/_/g, ' ')}
              </strong>
            </span>
          </div>

          <div className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-amber-100 text-amber-900">
            {order.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.key);
            const isCompleted = status === 'completed';

            return (
              <div
                key={step.key}
                className="flex-1 flex md:flex-col items-center md:text-center gap-3 relative z-10"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Notes Log */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Timeline Updates:
            </h4>
            <div className="space-y-1.5 text-xs text-gray-600">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:
                  </span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {h.status.replace(/_/g, ' ')}
                  </span>
                  {h.note && <span className="text-gray-500">— {h.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Fulfillment Address or Pickup Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fulfillment Details */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
            {isStorePickup ? 'Store Pickup Location' : 'Delivery Address'}
          </h3>

          {isStorePickup ? (
            <div className="space-y-2 text-xs">
              <div className="font-black text-sm text-gray-900">{settings.storeName}</div>
              <div className="text-gray-600 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city} - {settings.pincode}
                </span>
              </div>
              <div className="text-gray-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Showroom Hours: {settings.openingHours}</span>
              </div>
              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  <span>Get Driving Directions (Google Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="font-black text-sm text-gray-900">{order.customerName}</div>
              <p>{order.deliveryAddress?.address}</p>
              <p>
                {order.deliveryAddress?.area ? `${order.deliveryAddress.area}, ` : ''}
                {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
              </p>
              <p className="text-gray-500 pt-1 font-mono">Mobile: {order.customerPhone}</p>
              {order.deliveryAddress?.instructions && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2">
                  <strong>Delivery Note:</strong> {order.deliveryAddress.instructions}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
            Payment Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900">{formatINR(order.subtotal)}</span>
            </div>

            {order.festivalDiscountAmount > 0 && (
              <div className="flex justify-between text-festive-red font-semibold">
                <span>Festival Offer Applied</span>
                <span>- {formatINR(order.festivalDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Fulfillment Fee</span>
              <span className="font-semibold text-gray-900">
                {order.deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : formatINR(order.deliveryFee)}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-gray-900">
              <span>Grand Total</span>
              <span className="text-brand-700">{formatINR(order.totalAmount)}</span>
            </div>

            <div className="pt-2 text-[11px] text-gray-500">
              Payment Mode: <strong className="uppercase text-gray-800">{order.paymentMethod.replace(/_/g, ' ')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ordered Items List */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Items in this Order ({order.items.length})
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 py-2 border-b border-gray-50 last:border-0">
              <div className="w-14 h-14 bg-gray-50 rounded-xl p-1.5 shrink-0 border border-gray-100">
                <SafeImage src={item.image} alt={item.productName} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {item.brand}
                </span>
                <Link href={`/product/${item.productId}`} className="font-bold text-xs sm:text-sm text-gray-900 hover:text-brand-600 truncate block">
                  {item.productName}
                </Link>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span className="font-semibold text-gray-900">{formatINR(item.price)} each</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-xs sm:text-sm text-gray-900 block">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
