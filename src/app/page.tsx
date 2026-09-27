import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Star,
  ShieldCheck,
  Store,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DurgaPujaBanner } from '@/components/DurgaPujaBanner';
import { ProductCard } from '@/components/ProductCard';
import { getAllProducts, getAllCategories, getStoreSettings } from '@/lib/db';
import { generateWhatsAppUrl } from '@/lib/utils';

export default function HomePage() {
  const allProducts = getAllProducts();
  const categories = getAllCategories();
  const settings = getStoreSettings();

  // Curated lists
  const trendingProducts = allProducts.filter((p) => p.isFeatured).slice(0, 8);
  const festivalDeals = allProducts.filter((p) => p.festivalOffer && p.discount >= 20).slice(0, 8);
  const bestsellers = allProducts.filter((p) => p.isBestseller).slice(0, 8);

  const popularBrands = [
    { name: 'Samsung', category: 'mobiles', logoText: 'SAMSUNG' },
    { name: 'Apple', category: 'mobiles', logoText: 'APPLE' },
    { name: 'Sony', category: 'tvs', logoText: 'SONY' },
    { name: 'LG', category: 'refrigerators', logoText: 'LG' },
    { name: 'OnePlus', category: 'mobiles', logoText: 'ONEPLUS' },
    { name: 'Xiaomi', category: 'mobiles', logoText: 'XIAOMI' },
    { name: 'Daikin', category: 'air-conditioners', logoText: 'DAIKIN' },
    { name: 'Philips', category: 'kitchen-appliances', logoText: 'PHILIPS' },
    { name: 'boAt', category: 'audio', logoText: 'BOAT' },
    { name: 'Bosch', category: 'washing-machines', logoText: 'BOSCH' },
    { name: 'Havells', category: 'electricals', logoText: 'HAVELLS' },
    { name: 'Wipro', category: 'electricals', logoText: 'WIPRO' },
  ];

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

  const storeWhatsAppUrl = generateWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.storeName}, I saw your Durga Puja offers online and want to enquire about deals.`
  );

  return (
    <div className="space-y-6 sm:space-y-10 pb-8 overflow-hidden">
      {/* 1. Hero Festive Campaign Banner */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-2 sm:pt-6">
        <DurgaPujaBanner />
      </section>

      {/* 2. Category Shortcuts Bar: Horizontal Swipeable Carousel on Mobile, Grid on Tablet/Desktop */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
            <span>Shop By Department</span>
          </h2>
          <span className="text-[11px] sm:text-xs text-brand-600 font-semibold">
            Swipe categories →
          </span>
        </div>

        {/* Carousel Container */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 md:grid-cols-9 sm:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="shrink-0 w-20 sm:w-auto group flex flex-col items-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-gray-100 hover:border-brand-300 hover:shadow-md hover:shadow-brand-500/10 transition-all text-center shadow-xs"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 group-hover:from-brand-50 group-hover:to-brand-100 flex items-center justify-center text-xl sm:text-2xl mb-1 transition-transform group-hover:scale-110">
                {categoryEmojiMap[cat.slug] || '🔌'}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-800 group-hover:text-brand-700 truncate w-full leading-tight">
                {cat.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-gray-400 font-medium hidden sm:inline mt-0.5">
                View All
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Dual Fulfillment Choice Callout Banner */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-3.5 sm:p-5 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  Fastest Option
                </span>
                <h3 className="text-sm sm:text-lg font-black text-white mt-0.5 truncate">
                  Buy Online, Pick Up at Store
                </h3>
                <p className="text-[11px] sm:text-xs text-orange-100 truncate sm:whitespace-normal">
                  Ready in 30 mins at showroom with unboxing check.
                </p>
              </div>
            </div>
            <Link
              href="/category/mobiles"
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white text-orange-700 hover:bg-orange-50 rounded-xl text-xs font-bold shrink-0 shadow transition-colors ml-2"
            >
              Shop Now
            </Link>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-3.5 sm:p-5 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  Doorstep Comfort
                </span>
                <h3 className="text-sm sm:text-lg font-black text-white mt-0.5 truncate">
                  Local Doorstep Delivery
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-100 truncate sm:whitespace-normal">
                  Safe dispatch directly from our retail shop by store staff.
                </p>
              </div>
            </div>
            <Link
              href="/search?festival=true"
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shrink-0 shadow transition-colors ml-2"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Durga Puja Festival Deals Section (Strict 2 columns on Mobile) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-festive-red font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Durga Puja Special</span>
            </div>
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              Top Festive Deals (Save 20%+)
            </h2>
          </div>
          <Link
            href="/search?festival=true"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {festivalDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Trending Electronics (Strict 2 columns on Mobile) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-brand-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>Hot Picks</span>
            </div>
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              Trending Electronics This Week
            </h2>
          </div>
          <Link
            href="/category/mobiles"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 shrink-0"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Shop By Brand Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              Shop By Official Brands
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              100% Original Manufacturer Products with Authorized Warranty
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {popularBrands.map((b) => (
            <Link
              key={b.name}
              href={`/category/${b.category}?brand=${encodeURIComponent(b.name)}`}
              className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-100 hover:border-brand-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center shadow-xs"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 group-hover:bg-amber-50 flex items-center justify-center mb-1.5 font-black text-[11px] sm:text-sm text-gray-800 tracking-wider group-hover:text-brand-600 transition-colors">
                {b.logoText.slice(0, 4)}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-900 group-hover:text-brand-600 truncate w-full">
                {b.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Best Sellers Grid (Strict 2 columns on Mobile) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">
              Best Selling Appliances
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 shrink-0"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Visit Showroom & Local Contact Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-10 border border-gray-700 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 text-center lg:text-left w-full">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider inline-block">
              Local Neighborhood Store
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Prefer To See Before You Buy?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Visit our physical electronics & electrical showroom at {settings.address}, {settings.city}. Experience live product demos, compare smartphone cameras, check soundbars, and get hands-on advice from our store experts.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 pt-1 sm:pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store</span>
              </a>

              <a
                href={storeWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Enquiry</span>
              </a>

              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors border border-white/10 shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10 text-xs space-y-2.5 w-full lg:w-72 shrink-0">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[10px] sm:text-[11px]">
              Store Timings & Services
            </h4>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{settings.openingHours}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GST Bill & Brand Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Store className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Zero-cost EMI & Card Swipes</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
