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
  ShieldCheck,
  Menu,
  X,
  User,
  Download,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppUrl } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { settings, campaign, categories } = useStore();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const whatsappMessage = `Hello ${settings.storeName}, I am browsing your online store and have a query about your products and festive offers.`;
  const whatsappUrl = generateWhatsAppUrl(settings.whatsapp, whatsappMessage);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* 1. Festive / Local Shop Top Announcement Bar */}
      <div className="bg-gradient-to-r from-festive-deep via-red-800 to-amber-900 text-white text-xs py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
            <span className="font-semibold text-amber-200">
              {campaign.isActive ? campaign.title : 'Festival Deals Active'}:
            </span>
            <span className="truncate">{campaign.tagline}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-amber-100 font-medium shrink-0">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {settings.city}, {settings.state}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {settings.openingHours}
            </span>
            <Link
              href="/owner-login"
              className="text-amber-200 hover:text-white underline underline-offset-2 text-[11px]"
            >
              Owner Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Store Name */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              SB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-gray-900 leading-none">
                  {settings.storeName}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-brand-700 font-medium block mt-0.5 leading-none">
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop & Tablet */}
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

          {/* Quick Contact & Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Phone Call Button */}
            <a
              href={`tel:${settings.phone}`}
              title="Call Store"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-brand-600 hover:bg-orange-50 transition-colors border border-gray-200 sm:border-transparent"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">Call Shop</span>
            </a>

            {/* WhatsApp Store Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-500" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-gray-700 hover:text-brand-600 hover:bg-orange-50 transition-colors flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-festive-red text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only shown on small screens) */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 sm:hidden relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phones, TVs, ACs, appliances..."
            className="w-full pl-9 pr-20 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 text-white rounded-full text-xs font-semibold"
          >
            Search
          </button>
        </form>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2 pb-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
              Popular Categories
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-800">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-brand-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-brand-600 font-bold">•</span>
                  {cat.name.split(' ')[0]}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-1 text-xs">
              <Link
                href="/order-tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded hover:bg-gray-50 flex items-center justify-between text-gray-700"
              >
                <span>Track My Order</span>
                <span className="text-brand-600 font-bold">→</span>
              </Link>
              <Link
                href="/owner-login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded bg-amber-50 text-amber-900 font-semibold flex items-center justify-between"
              >
                <span>Owner Login & Dashboard</span>
                <span>🔒</span>
              </Link>
            </div>
          </div>
        )}
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
  );
}
