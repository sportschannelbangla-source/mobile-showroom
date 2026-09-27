'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Menu,
  X,
  Lock,
  ChevronRight,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppUrl } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { settings, campaign, categories, isMobileMenuOpen, setIsMobileMenuOpen } = useStore();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const whatsappMessage = `Hello ${settings.storeName}, I am browsing your online store and have a query about your products and festive offers.`;
  const whatsappUrl = generateWhatsAppUrl(settings.whatsapp, whatsappMessage);

  const categoryEmojiMap: Record<string, string> = {
    mobiles: '📱',
    tvs: '📺',
    refrigerators: '❄️',
    'air-conditioners': '💨',
    'washing-machines': '🧺',
    audio: '🎧',
    laptops: '💻',
    'kitchen-appliances': '🍳',
    electricals: '⚡',
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        {/* 1. Festive / Local Shop Top Announcement Bar */}
        <div className="bg-gradient-to-r from-festive-deep via-red-800 to-amber-900 text-white py-1 px-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
              </span>
              <span className="font-semibold text-amber-200 shrink-0">
                {campaign.isActive ? campaign.title : 'Festive Deals'}:
              </span>
              <span className="truncate text-amber-100">{campaign.tagline}</span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-amber-100 font-medium shrink-0">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                {settings.city}, {settings.state}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                {settings.openingHours}
              </span>
              <Link
                href="/owner-login"
                className="text-amber-200 hover:text-white underline underline-offset-2 text-[11px] flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Owner Portal
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* MOBILE ROW 1 / DESKTOP HEADER ROW */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Store Name */}
            <Link href="/" className="flex items-center gap-2 min-w-0 group shrink">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center font-black text-base sm:text-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0">
                SB
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm sm:text-xl tracking-tight text-gray-900 block truncate leading-tight">
                  {settings.storeName}
                </span>
                <span className="text-[10px] sm:text-xs text-brand-700 font-medium block truncate leading-none mt-0.5">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar (Hidden on Mobile) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex flex-1 max-w-xl mx-2 relative"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Samsung TV, iPhone 16, Inverter AC, Mixer Grinder..."
                  className="w-full pl-10 pr-24 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Desktop Actions & Mobile Quick Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Desktop Only: Phone Call Button */}
              <a
                href={`tel:${settings.phone}`}
                title="Call Store"
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-brand-600 hover:bg-orange-50 transition-colors border border-gray-200"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Shop</span>
              </a>

              {/* Desktop Only: WhatsApp Store Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                <span>WhatsApp</span>
              </a>

              {/* Cart Button (Always visible on mobile & desktop) */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-gray-700 hover:text-brand-600 hover:bg-orange-50 transition-colors flex items-center justify-center shrink-0 border border-gray-200 sm:border-transparent"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-festive-red text-white text-[10px] sm:text-[11px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu Toggle (Mobile Only) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-xl text-gray-800 hover:bg-gray-100 border border-gray-200 shrink-0"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* MOBILE ROW 2: Full-Width Search Input */}
          <form onSubmit={handleSearchSubmit} className="mt-2 sm:hidden relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Samsung, iPhone, Smart TV, AC..."
              className="w-full pl-9 pr-20 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white shadow-inner"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Search
            </button>
          </form>

          {/* MOBILE ROW 3: Compact Quick Action Strip */}
          <div className="mt-2 sm:hidden grid grid-cols-4 gap-1.5 pt-1.5 border-t border-gray-100 text-[11px] font-bold">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 active:scale-95 transition-transform"
            >
              <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Call</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-3 h-3 text-emerald-700 fill-emerald-600 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </a>

            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 active:scale-95 transition-transform"
            >
              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">Store</span>
            </a>

            <Link
              href="/owner-login"
              className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300/80 active:scale-95 transition-transform"
            >
              <Lock className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">Owner</span>
            </Link>
          </div>
        </div>

        {/* 3. Category Horizontal Quick Bar (Desktop) */}
        <div className="hidden sm:block bg-gray-50/80 border-t border-gray-100 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-xs font-semibold text-gray-700">
            <Link
              href="/"
              className="hover:text-brand-600 transition-colors shrink-0 text-brand-700 font-bold"
            >
              All Offers
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="hover:text-brand-600 transition-colors shrink-0 text-gray-600 hover:underline underline-offset-4"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/order-tracking"
              className="ml-auto hover:text-brand-600 transition-colors shrink-0 text-gray-600 flex items-center gap-1"
            >
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 4. Full Mobile Slide-Out Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[85vw] max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-festive-deep to-red-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-gray-950 font-black text-sm flex items-center justify-center">
                  SB
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">{settings.storeName}</h3>
                  <span className="text-[10px] text-amber-200">{settings.city} Showroom</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Store Info */}
            <div className="p-3 bg-amber-50/50 border-b border-amber-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {settings.openingHours}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm"
                >
                  <Phone className="w-3 h-3" />
                  Call Store
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-center font-bold text-[11px] flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Departments / Categories List */}
            <div className="p-3 flex-1 overflow-y-auto">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Shop By Department
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 text-gray-800 hover:text-brand-600 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold">
                      <span className="text-base">{categoryEmojiMap[cat.slug] || '🔌'}</span>
                      {cat.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>

              {/* Utility Links */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
                <Link
                  href="/search?festival=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-50 text-festive-red font-bold text-xs"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 fill-festive-red" />
                    Durga Puja Special Offers
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/order-tracking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-700 text-xs font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    Track My Order
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-700 text-xs font-medium"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Visit Physical Showroom
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Drawer Footer: Owner Portal Button */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <Link
                href="/owner-login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Owner Login & Dashboard</span>
              </Link>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Authorized showroom staff & admin only
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
