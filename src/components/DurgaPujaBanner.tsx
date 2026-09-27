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
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [campaign.endDate]);

  if (!campaign.isActive) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-festive-deep to-amber-950 text-white shadow-xl border border-amber-600/30">
      {/* Decorative festive background accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-red-500/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 px-5 py-6 sm:py-8 sm:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Column: Festival Heading & Offer Details */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Grand Festive Sale • Limited Period</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-amber-100 tracking-tight leading-tight">
            {campaign.title}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-amber-200/90 font-medium">
            {campaign.tagline}
          </p>

          <p className="mt-1.5 text-xs text-gray-300 leading-relaxed hidden sm:block">
            {campaign.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              href="/search?festival=true"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Explore Festival Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/category/mobiles"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-colors border border-white/20"
            >
              Smartphones Offer
            </Link>
          </div>
        </div>

        {/* Right Column: Festive Countdown Clock Box */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-500/30 text-center w-full md:w-auto shrink-0 shadow-inner">
          <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Sale Ends Before Puja</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-white/10 rounded-xl p-2 min-w-[56px] border border-white/10">
              <span className="text-lg sm:text-2xl font-black text-white block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-semibold">Days</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2 min-w-[56px] border border-white/10">
              <span className="text-lg sm:text-2xl font-black text-white block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-semibold">Hours</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2 min-w-[56px] border border-white/10">
              <span className="text-lg sm:text-2xl font-black text-white block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-semibold">Mins</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2 min-w-[56px] border border-white/10">
              <span className="text-lg sm:text-2xl font-black text-white block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-semibold">Secs</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-amber-200/80 font-medium flex items-center justify-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Pickup & Home Delivery Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
