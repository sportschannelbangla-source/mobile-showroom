'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, MessageCircle, Zap, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatINR, generateWhatsAppUrl, generateProductWhatsAppMessage, getProductPrimaryImage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings, campaign } = useStore();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock === 'out_of_stock';
  const isLimited = product.stock === 'limited_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    router.push('/checkout');
  };

  // WhatsApp Enquiry
  const whatsappMsg = generateProductWhatsAppMessage(
    settings.storeName,
    product.name,
    product.price,
    typeof window !== 'undefined' ? `${window.location.origin}/product/${product.id}` : undefined
  );
  const whatsappUrl = generateWhatsAppUrl(settings.whatsapp, whatsappMsg);

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative w-full">
      {/* 1. Festive Tag or Discount Pill */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-0.5 items-start">
        {campaign.isActive && product.festivalOffer && (
          <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[9px] sm:text-[10px] tracking-wide shadow-xs flex items-center gap-0.5">
            <span>🪔</span> Puja Offer
          </span>
        )}
        {product.discount > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px] sm:text-[10px] shadow-xs">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* WhatsApp Enquiry Quick Icon */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Ask on WhatsApp"
        className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-xs border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shadow-xs"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 hover:fill-white" />
      </a>

      {/* Product Image Clickable Link */}
      <Link
        href={`/product/${product.id}`}
        className="block relative bg-gray-50/50 aspect-square p-2.5 sm:p-4 overflow-hidden group-hover:bg-amber-50/20 transition-colors"
      >
        <SafeImage
          src={getProductPrimaryImage(product)}
          alt={product.name}
          brand={product.brand}
          category={product.category}
          priority={priority}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock Pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded shrink-0">
                Out of Stock
              </span>
            ) : isLimited ? (
              <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 py-0.2 rounded shrink-0">
                Few Left
              </span>
            ) : (
              <span className="text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded shrink-0">
                In Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors leading-tight min-h-[32px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-bold text-[10px]">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-[10px] text-gray-600 font-medium">({product.reviewCount})</span>
          </div>

          {/* Price Block */}
          <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-600 line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 grid grid-cols-2 gap-1 sm:gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-1.5 px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-0.5 truncate ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-50 text-brand-700 hover:bg-brand-600 hover:text-white border border-brand-200/60'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 shrink-0" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 shrink-0" />
                <span className="truncate">+ Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`py-1.5 px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-0.5 truncate ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs shadow-brand-500/20 active:scale-95'
            }`}
          >
            <Zap className="w-3 h-3 fill-current shrink-0" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
