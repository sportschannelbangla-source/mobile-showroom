'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Clock, ArrowRight, Gift } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export function DurgaPujaBanner() {
  const { campaign } = useStore();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 14, hours: 8, minutes: 22, seconds: 45 });

  useEffect(() => {
    if (!campaign.endDate) return;

    const target = new Date(campaign.endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [campaign.endDate]);

  if (!campaign.isActive) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-950 via-festive-deep to-amber-950 text-white shadow-xl border border-amber-600/30 w-full">
      {/* Decorative festive background accents - contained inside overflow-hidden */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-red-500/20 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 px-3.5 py-4 sm:py-8 sm:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* Left Column: Festival Heading & Offer Details */}
        <div className="w-full md:max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span>Grand Festive Sale • Limited Period</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-amber-100 tracking-tight leading-tight">
            {campaign.title}
          </h2>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-amber-200/90 font-medium">
            {campaign.tagline}
          </p>

          <p className="mt-1.5 text-xs text-gray-300 leading-relaxed hidden sm:block">
            {campaign.description}
          </p>

          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
            <Link
              href="/search?festival=true"
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-transform active:scale-95 flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <span>Explore Festival Deals</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>

            <Link
              href="/category/mobiles"
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-colors border border-white/20 shrink-0"
            >
              Smartphones Offer
            </Link>
          </div>
        </div>

        {/* Right Column: Festive Countdown Clock Box */}
        <div className="bg-black/35 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-amber-500/30 text-center w-full md:w-auto shrink-0 shadow-inner">
          <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-2">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Sale Ends Before Puja</span>
          </div>

          {/* Fluid Countdown Grid - No rigid min-w */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 text-center">
            <div className="bg-white/10 rounded-lg sm:rounded-xl py-1.5 px-1 sm:p-2 border border-white/10 flex flex-col items-center justify-center">
              <span className="text-base sm:text-2xl font-black text-white block leading-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-300 uppercase font-semibold">Days</span>
            </div>

            <div className="bg-white/10 rounded-lg sm:rounded-xl py-1.5 px-1 sm:p-2 border border-white/10 flex flex-col items-center justify-center">
              <span className="text-base sm:text-2xl font-black text-white block leading-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-300 uppercase font-semibold">Hours</span>
            </div>

            <div className="bg-white/10 rounded-lg sm:rounded-xl py-1.5 px-1 sm:p-2 border border-white/10 flex flex-col items-center justify-center">
              <span className="text-base sm:text-2xl font-black text-white block leading-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-300 uppercase font-semibold">Mins</span>
            </div>

            <div className="bg-white/10 rounded-lg sm:rounded-xl py-1.5 px-1 sm:p-2 border border-white/10 flex flex-col items-center justify-center">
              <span className="text-base sm:text-2xl font-black text-white block leading-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-300 uppercase font-semibold">Secs</span>
            </div>
          </div>

          <div className="mt-2.5 text-[10px] sm:text-[11px] text-amber-200/90 font-medium flex items-center justify-center gap-1">
            <Gift className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Store Pickup & Home Delivery Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
