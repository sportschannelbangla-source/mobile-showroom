'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { toggleMobileMenu, isMobileMenuOpen } = useStore();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/category/mobiles', icon: Grid },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: totalItems },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1 px-1 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center relative py-1 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-festive-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
            </Link>
          );
        })}

        {/* 5th item: Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className={`flex flex-col items-center justify-center relative py-1 px-1 rounded-lg transition-colors ${
            isMobileMenuOpen
              ? 'text-brand-600 font-bold'
              : 'text-gray-500 hover:text-gray-900 font-medium'
          }`}
          aria-label="Toggle Full Menu"
        >
          <div className="relative">
            <Menu className="w-5 h-5 stroke-2" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Menu</span>
        </button>
      </div>
    </nav>
  );
}
