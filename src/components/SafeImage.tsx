'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  brand?: string;
  category?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = '',
  brand = '',
  category = '',
  priority = false,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check if image is already completed (e.g. from SSR, browser cache, or fast connection)
  const checkImageComplete = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) {
        setIsLoading(false);
        setHasError(false);
      } else if (img.naturalWidth === 0 && img.src) {
        // Complete but 0 dimensions means load error
        setIsLoading(false);
        setHasError(true);
      }
    }
  }, []);

  // Callback ref triggered immediately upon DOM element attachment
  const refCallback = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      if (node) {
        checkImageComplete(node);
      }
    },
    [checkImageComplete]
  );

  // Effect to verify completeness on initial hydration and when src changes
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    // Reset states for new src
    setHasError(false);

    if (imgRef.current) {
      checkImageComplete(imgRef.current);
    }

    // Failsafe timer: Under NO circumstances should a customer be stuck with a spinner forever
    const timer = setTimeout(() => {
      if (imgRef.current) {
        if (imgRef.current.naturalWidth > 0) {
          setIsLoading(false);
          setHasError(false);
        } else {
          // If still not loaded after 2.5s, remove spinner and let image show or error out
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [src, checkImageComplete]);

  // Fallback UI when image source is invalid or fails to load
  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900 border border-amber-200/50 p-3 text-center select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-white/80 shadow-xs flex items-center justify-center mb-1.5">
          <svg
            className="w-5 h-5 text-brand-600"
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
        {brand && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 truncate max-w-full">
            {brand}
          </span>
        )}
        <span className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 font-medium leading-tight">
          {alt}
        </span>
        {category && (
          <span className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-semibold truncate max-w-full">
            {category}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton / Spinner (dismissed as soon as img.complete is true) */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Actual Product Image */}
      <img
        ref={refCallback}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
