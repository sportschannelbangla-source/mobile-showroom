'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Store,
  Headphones,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { generateWhatsAppUrl } from '@/lib/utils';

export function Footer() {
  const { settings, categories } = useStore();
  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.storeName}, I have a general enquiry regarding products and store visiting hours.`
  );

  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-20 sm:pb-12 border-t border-gray-800">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 mb-10 pb-8 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Genuine</h4>
              <p className="text-xs text-gray-400 mt-0.5">Direct from authorized brand distributors</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Buy From Store</h4>
              <p className="text-xs text-gray-400 mt-0.5">Order online, pick up directly from our retail shop</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Local Home Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">Fast local dispatch with unboxing assistance</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Local Support</h4>
              <p className="text-xs text-gray-400 mt-0.5">Talk to actual store staff via Phone & WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Store Profile */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-sm">
              SB
            </div>
            <span className="text-white font-extrabold text-base tracking-tight">
              {settings.storeName}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            {settings.tagline}. Authorized retailer for smartphones, smart TVs, home appliances, inverter air conditioners, and electrical fittings with manufacturer warranties.
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors border border-gray-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Shop</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition-colors border border-emerald-800"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
            Shop By Category
          </h4>
          <ul className="space-y-2 text-xs">
            {categories.slice(0, 7).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="hover:text-brand-400 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
            Customer Care & Services
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/order-tracking" className="hover:text-brand-400 transition-colors">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-brand-400 transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li className="text-gray-400">
              Fulfillment Options:
              <span className="block text-[11px] text-gray-500 mt-0.5">
                • Store Pickup: 100% Free at our retail counter
                <br />• Home Delivery: Standard local courier dispatch
              </span>
            </li>
            <li className="text-gray-400">
              Warranty:
              <span className="block text-[11px] text-gray-500 mt-0.5">
                • All products include official manufacturer brand warranty with tax invoice.
              </span>
            </li>
          </ul>
        </div>

        {/* Visit Our Physical Store */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
            Visit Retail Showroom
          </h4>
          <div className="space-y-2.5 text-xs text-gray-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>{settings.openingHours}</span>
            </div>

            <div className="pt-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Protected Admin Link */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <p>
          © {new Date().getFullYear()} {settings.storeName}. All rights reserved. Durga Puja Festival Campaign Active.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/owner-login"
            className="flex items-center gap-1 text-gray-400 hover:text-amber-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Store Owner Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
