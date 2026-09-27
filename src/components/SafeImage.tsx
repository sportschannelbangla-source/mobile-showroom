'use client';

import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  brand?: string;
  category?: string;
}

export function SafeImage({ src, alt, className = '', brand = '', category = '' }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900 border border-amber-200/50 p-4 text-center select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-white/80 shadow-sm flex items-center justify-center mb-2">
          <svg
            className="w-6 h-6 text-brand-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        {brand && <span className="text-xs font-bold uppercase tracking-wider text-brand-700">{brand}</span>}
        <span className="text-xs text-gray-600 line-clamp-2 mt-0.5 font-medium">{alt}</span>
        {category && (
          <span className="text-[10px] mt-1.5 px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 font-semibold">
            {category}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
