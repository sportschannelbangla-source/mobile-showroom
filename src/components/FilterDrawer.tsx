'use client';

import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

export interface FilterState {
  brand: string[];
  priceRange: string;
  minRating: number;
  minDiscount: number;
  inStockOnly: boolean;
  sortBy: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableBrands: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under ₹5,000', value: '0-5000' },
  { label: '₹5,000 – ₹10,000', value: '5000-10000' },
  { label: '₹10,000 – ₹25,000', value: '10000-25000' },
  { label: '₹25,000 – ₹50,000', value: '25000-50000' },
  { label: '₹50,000+', value: '50000-999999' },
];

export const SORT_OPTIONS = [
  { label: 'Popular & Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Discount', value: 'discount' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
];

export function FilterDrawer({
  isOpen,
  onClose,
  availableBrands,
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const toggleBrand = (b: string) => {
    const next = filters.brand.includes(b)
      ? filters.brand.filter((x) => x !== b)
      : [...filters.brand, b];
    onFilterChange({ ...filters, brand: next });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-base text-gray-900">Filters & Sort</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 underline"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. Sort By */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Sort By
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ ...filters, sortBy: opt.value })}
                  className={`py-2 px-2.5 rounded-xl border text-left font-medium transition-all ${
                    filters.sortBy === opt.value
                      ? 'border-brand-600 bg-orange-50 text-brand-800 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Price Range
            </h4>
            <div className="space-y-1.5 text-xs">
              {PRICE_RANGES.map((pr) => (
                <label
                  key={pr.value}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={pr.value}
                    checked={filters.priceRange === pr.value}
                    onChange={(e) =>
                      onFilterChange({ ...filters, priceRange: e.target.value })
                    }
                    className="accent-brand-600 w-4 h-4"
                  />
                  <span className="text-gray-800 font-medium">{pr.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Brands */}
          {availableBrands.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                Brand
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map((b) => {
                  const isChecked = filters.brand.includes(b);
                  return (
                    <label
                      key={b}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                        isChecked
                          ? 'border-brand-600 bg-orange-50 text-brand-900 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(b)}
                        className="accent-brand-600 rounded w-4 h-4"
                      />
                      <span className="truncate">{b}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Minimum Discount */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Discount
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {[0, 10, 20, 30, 40].map((d) => (
                <button
                  key={d}
                  onClick={() => onFilterChange({ ...filters, minDiscount: d })}
                  className={`px-3 py-1.5 rounded-full border font-semibold ${
                    filters.minDiscount === d
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {d === 0 ? 'All Discounts' : `${d}% or more`}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Minimum Rating */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Customer Rating
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {[0, 4.0, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => onFilterChange({ ...filters, minRating: r })}
                  className={`px-3 py-1.5 rounded-full border font-semibold ${
                    filters.minRating === r
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {r === 0 ? 'All Ratings' : `${r}★ & above`}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Availability */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer text-xs">
              <span className="font-bold text-gray-800">In Stock Products Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  onFilterChange({ ...filters, inStockOnly: e.target.checked })
                }
                className="accent-brand-600 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md transition-colors text-center"
          >
            Apply Filters ({totalResults} Products)
          </button>
        </div>
      </div>
    </div>
  );
}
