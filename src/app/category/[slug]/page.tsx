'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { FilterDrawer, FilterState } from '@/components/FilterDrawer';
import { Product, Category } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  const initialBrand = searchParams.get('brand') || '';

  const { categories } = useStore();
  const currentCategory = categories.find((c) => c.slug === slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    brand: initialBrand ? [initialBrand] : [],
    priceRange: '',
    minRating: 0,
    minDiscount: 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');

  // Load products for category
  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products?category=${slug}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error('Failed to load category products:', e);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadCategoryProducts();
    }
  }, [slug]);

  // Available brands in this category
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Available subcategories
  const availableSubcategories = useMemo(() => {
    const list = currentCategory?.subcategories || [];
    return ['All', ...list];
  }, [currentCategory]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Subcategory filter
    if (selectedSubcategory !== 'All') {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
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
      // Featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, selectedSubcategory, filters]);

  const activeFilterCount =
    (filters.brand.length > 0 ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minDiscount > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      brand: [],
      priceRange: '',
      minRating: 0,
      minDiscount: 0,
      inStockOnly: false,
      sortBy: 'featured',
    });
    setSelectedSubcategory('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900 capitalize">
          {currentCategory ? currentCategory.name : slug}
        </span>
        {filters.brand.length === 1 && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-brand-600">{filters.brand[0]}</span>
          </>
        )}
      </nav>

      {/* 2. Category Heading Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {currentCategory?.name || 'Category'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            {currentCategory?.description || 'Browse all genuine electronics in this category with official brand warranty.'}
          </p>
        </div>

        <div className="text-xs font-bold text-amber-900 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-amber-200 shadow-xs shrink-0 self-start sm:self-auto">
          <span>{filteredProducts.length} Items Available</span>
        </div>
      </div>

      {/* 3. Subcategory Quick Filter Pills */}
      {availableSubcategories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {availableSubcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedSubcategory === sub
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* 4. Controls Bar (Filter Button & Quick Brands) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-50 shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>Filters & Sort</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Brand quick pills */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-gray-400 font-semibold mr-1">Brands:</span>
          {availableBrands.slice(0, 8).map((b) => {
            const isSelected = filters.brand.includes(b);
            return (
              <button
                key={b}
                onClick={() => {
                  setFilters({
                    ...filters,
                    brand: isSelected
                      ? filters.brand.filter((x) => x !== b)
                      : [...filters.brand, b],
                  });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Product Grid */}
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
          <h3 className="font-bold text-base text-gray-900">No products match your filters</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your price, brand, or discount filters to see all available products in this category.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow hover:bg-brand-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Filter Drawer Modal */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        availableBrands={availableBrands}
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        totalResults={filteredProducts.length}
      />
    </div>
  );
}
