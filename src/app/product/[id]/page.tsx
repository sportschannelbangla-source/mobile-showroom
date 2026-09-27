'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  ShoppingCart,
  Zap,
  Phone,
  MessageCircle,
  Truck,
  Store,
  ShieldCheck,
  Check,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatINR, generateWhatsAppUrl, generateProductWhatsAppMessage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { SafeImage } from '@/components/SafeImage';
import { SpecsTable } from '@/components/SpecsTable';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const { addToCart } = useCart();
  const { settings, campaign } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data: Product = await res.json();
          setProduct(data);
          setSelectedImage(data.images[0] || '');

          // Load related products
          const relRes = await fetch(`/api/products?category=${data.category}&limit=4`);
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedProducts((relData.products || []).filter((p: Product) => p.id !== data.id));
          }
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for may have been archived or removed.</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Storefront
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 'out_of_stock';
  const isLimited = product.stock === 'limited_stock';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product);
    router.push('/checkout');
  };

  // WhatsApp Enquiry
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappMsg = generateProductWhatsAppMessage(
    settings.storeName,
    product.name,
    product.price,
    productUrl
  );
  const whatsappUrl = generateWhatsAppUrl(settings.whatsapp, whatsappMsg);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at ${settings.storeName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-brand-600 shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href={`/category/${product.category}`} className="hover:text-brand-600 shrink-0 capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-gray-900 truncate">{product.name}</span>
      </nav>

      {/* 2. Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Left Column: Image Gallery */}
        <div className="space-y-3">
          {/* Large Image Preview Card */}
          <div className="relative aspect-square bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-center shadow-sm overflow-hidden group">
            {/* Festival Badge */}
            {campaign.isActive && product.festivalOffer && (
              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <span>🪔</span> Durga Puja Offer: 20% OFF
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              title="Share Product"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <SafeImage
              src={selectedImage || product.images[0]}
              alt={product.name}
              brand={product.brand}
              category={product.category}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border p-1 bg-white shrink-0 overflow-hidden transition-all ${
                    selectedImage === img
                      ? 'border-brand-600 ring-2 ring-brand-500/30'
                      : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Local Assurance Bar below image */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/50 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{product.warranty}</span>
            </span>
            <span className="text-[11px] font-medium text-amber-800">
              Official Tax Invoice Included
            </span>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Actions */}
        <div className="space-y-5">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-brand-600 uppercase tracking-widest">
                {product.brand} • {product.model}
              </span>
              <span className="text-xs text-gray-600 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {product.reviewCount} Verified Buyer Ratings & Reviews
              </span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-gray-600 line-through">
                    MRP {formatINR(product.mrp)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {product.discount}% Discount
                  </span>
                </>
              )}
            </div>

            {campaign.isActive && product.festivalOffer && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-200/80 flex items-center justify-between text-xs">
                <span className="text-festive-red font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Durga Puja Festival Price Applied</span>
                </span>
                <span className="text-[11px] text-gray-500">Inclusive of all taxes</span>
              </div>
            )}
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-700">Stock Status:</span>
            {isOutOfStock ? (
              <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                Currently Out of Stock
              </span>
            ) : isLimited ? (
              <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                Limited Stock ({product.stockQuantity} remaining)
              </span>
            ) : (
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Available In Stock (Ready for Dispatch)
              </span>
            )}
          </div>

          {/* Dual Fulfillment Selection Notice */}
          <div className="rounded-2xl border border-gray-200 p-4 space-y-3 bg-white">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
              Two Ways to Purchase This Item:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/60">
                <div className="flex items-center gap-2 font-bold text-orange-950 mb-1">
                  <Store className="w-4 h-4 text-brand-600" />
                  <span>Buy / Reserve at Store</span>
                </div>
                <p className="text-[11px] text-orange-900/80">
                  Select &quot;Store Pickup&quot; at checkout. Visit {settings.storeName} to inspect and collect today.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                <div className="flex items-center gap-2 font-bold text-emerald-950 mb-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Local Home Delivery</span>
                </div>
                <p className="text-[11px] text-emerald-900/80">
                  Select &quot;Home Delivery&quot; at checkout. Dispatched directly from our shop to your doorstep.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons (Desktop / Tablet) */}
          <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-50 text-brand-700 hover:bg-brand-600 hover:text-white border border-brand-300'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 active:scale-95'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now / Reserve</span>
            </button>
          </div>

          {/* WhatsApp Product Enquiry Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ask on WhatsApp (Live Store Price)</span>
            </a>

            <a
              href={`tel:${settings.phone}`}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-gray-200"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Shop: {settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Product Specifications & Description */}
      <div className="pt-6 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Specifications */}
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight mb-3">
              Full Specifications
            </h3>
            <SpecsTable specifications={product.specifications} />
          </div>

          {/* Detailed Description */}
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight mb-2">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-gray-100">
              {product.description || product.shortDescription}
            </p>
          </div>
        </div>

        {/* Right Info Box: Retailer Verification */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 space-y-3.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Sold & Fulfilled By
            </h4>
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center shrink-0">
                SB
              </div>
              <div>
                <span className="font-black text-sm text-gray-900 block leading-tight">
                  {settings.storeName}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  Authorized Electronics Retail Showroom
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              More In {product.category.replace('-', ' ').toUpperCase()}
            </h3>
            <Link
              href={`/category/${product.category}`}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Sticky Mobile Bottom CTA Bar */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center gap-2 shadow-lg">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-orange-50 text-brand-700 border border-brand-300'
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          <span>{added ? 'Added' : 'Add to Cart'}</span>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400'
              : 'bg-brand-600 text-white shadow-md'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
