'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, MessageCircle, Zap, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatINR, generateWhatsAppUrl, generateProductWhatsAppMessage } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* 1. Festive Tag or Discount Pill */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {campaign.isActive && product.festivalOffer && (
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[10px] tracking-wide shadow-sm flex items-center gap-1">
            <span>🪔</span> Puja Offer
          </span>
        )}
        {product.discount > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] shadow-sm">
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
        title="Ask Price on WhatsApp"
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shadow-sm"
      >
        <MessageCircle className="w-4 h-4 fill-emerald-500 hover:fill-white" />
      </a>

      {/* Product Image Clickable Link */}
      <Link
        href={`/product/${product.id}`}
        className="block relative bg-gray-50/50 aspect-square p-4 overflow-hidden group-hover:bg-amber-50/20 transition-colors"
      >
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          brand={product.brand}
          category={product.category}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock Pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {product.brand}
            </span>
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                Out of Stock
              </span>
            ) : isLimited ? (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Few Left
              </span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                In Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold text-[11px]">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-[11px] text-gray-600 font-medium">({product.reviewCount})</span>
          </div>

          {/* Price Block */}
          <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-600 line-through">
                MRP {formatINR(product.mrp)}
              </span>
            )}
          </div>

          {/* Short specification highlight tag if available */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(product.specifications)
                .slice(0, 2)
                .map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded truncate max-w-[150px]"
                  >
                    {val}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-50 text-brand-700 hover:bg-brand-600 hover:text-white border border-brand-200/60'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="truncate">Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 active:scale-95'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
