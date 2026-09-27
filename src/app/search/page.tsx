'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { FilterDrawer, FilterState } from '@/components/FilterDrawer';
import { Product } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const festivalParam = searchParams.get('festival') === 'true';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    brand: [],
    priceRange: '',
    minRating: 0,
    minDiscount: festivalParam ? 20 : 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setIsLoading(true);
        let url = `/api/products?limit=150`;
        if (searchQuery.trim()) {
          url += `&q=${encodeURIComponent(searchQuery.trim())}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error('Failed to search products:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [searchQuery]);

  // Brands present in search results
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Festival filter
    if (festivalParam) {
      list = list.filter((p) => p.festivalOffer);
    }

    // Brand filter
    if (filters.brand.length > 0) {
      list = list.filter((p) => filters.brand.includes(p.brand));
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      list = list.filter((p) => p.price >= min && p.price <= max);
    }

    // Rating filter
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    // Discount filter
    if (filters.minDiscount > 0) {
      list = list.filter((p) => p.discount >= filters.minDiscount);
    }

    // Stock filter
    if (filters.inStockOnly) {
      list = list.filter((p) => p.stock === 'in_stock');
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'discount') {
      list.sort((a, b) => b.discount - a.discount);
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, festivalParam, filters]);

  const popularSuggestions = [
    'Samsung S24 Ultra',
    'iPhone 16',
    'LG 55 inch 4K TV',
    '1.5 Ton Inverter AC',
    'Mixer Grinder',
    'boAt Airdopes',
    'MacBook Air',
    'Double Door Fridge',
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
      {/* Search Header */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
              {festivalParam
                ? 'Durga Puja Mega Sale Deals'
                : searchQuery
                ? `Results for "${searchQuery}"`
                : 'All Products'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {filteredProducts.length} matching products
            </p>
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-50 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filter / Sort</span>
          </button>
        </div>

        {/* Popular Searches Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-gray-400 font-semibold shrink-0">Popular:</span>
          {popularSuggestions.map((term) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-700 font-medium shrink-0 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 py-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3"
            >
              <div className="aspect-square bg-gray-100 rounded-xl"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-brand-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-gray-900">
            No products found matching &quot;{searchQuery}&quot;
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try checking spelling or search for general keywords like &quot;TV&quot;, &quot;AC&quot;, &quot;Samsung&quot;, or &quot;Fridge&quot;.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow hover:bg-brand-700"
            >
              View All Catalogue
            </button>
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        availableBrands={availableBrands}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            brand: [],
            priceRange: '',
            minRating: 0,
            minDiscount: 0,
            inStockOnly: false,
            sortBy: 'featured',
          })
        }
        totalResults={filteredProducts.length}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-4 text-xs text-gray-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
