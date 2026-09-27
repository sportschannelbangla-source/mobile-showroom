'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  Sparkles,
  Settings,
  Plus,
  Edit,
  Trash2,
  Phone,
  MessageCircle,
  Truck,
  Store,
  CheckCircle,
  Clock,
  LogOut,
  AlertTriangle,
  Search,
  ExternalLink,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Product, Order, OrderStatus, StockStatus, StoreSettings, FestivalCampaign } from '@/lib/types';
import { formatINR, generateCustomerOrderWhatsAppMessage, generateWhatsAppUrl, CATEGORY_SPECS } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { SafeImage } from '@/components/SafeImage';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { settings: globalSettings, campaign: globalCampaign, refreshData } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'campaign' | 'settings'>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(globalSettings);
  const [campaign, setCampaign] = useState<FestivalCampaign>(globalCampaign);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Product Filters inside Admin
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Order Filters inside Admin
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderDeliveryFilter, setOrderDeliveryFilter] = useState<string>('all');

  // Modal State for Add / Edit Product
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Product Add / Edit
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Samsung');
  const [formCategory, setFormCategory] = useState('mobiles');
  const [formSubcategory, setFormSubcategory] = useState('Flagship Smartphones');
  const [formModel, setFormModel] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formMrp, setFormMrp] = useState<number>(0);
  const [formStock, setFormStock] = useState<StockStatus>('in_stock');
  const [formStockQty, setFormStockQty] = useState<number>(10);
  const [formWarranty, setFormWarranty] = useState('1 Year Manufacturer Warranty');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImages, setFormImages] = useState<string[]>(['']);
  const [formSpecs, setFormSpecs] = useState<Record<string, string>>({});
  const [formFestivalOffer, setFormFestivalOffer] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsNew, setFormIsNew] = useState(false);

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          setIsAuthenticated(true);
          loadDashboardData();
        } else {
          setIsAuthenticated(false);
          router.push('/owner-login');
        }
      } catch (e) {
        setIsAuthenticated(false);
        router.push('/owner-login');
      }
    }
    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [resProd, resOrd, resSet, resCam] = await Promise.all([
        fetch('/api/products?limit=300').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/campaign').then((r) => r.json()),
      ]);

      if (resProd && resProd.products) setProducts(resProd.products);
      if (resOrd && Array.isArray(resOrd)) setOrders(resOrd);
      if (resSet) setSettings(resSet);
      if (resCam) setCampaign(resCam);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/owner-login');
  };

  // Metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock === 'in_stock').length;
  const outOfStockProducts = products.filter((p) => p.stock === 'out_of_stock').length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ['new', 'confirmed', 'preparing'].includes(o.status)).length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);

  // Open Modal for New Product
  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('Samsung');
    setFormCategory('mobiles');
    setFormSubcategory('Flagship Smartphones');
    setFormModel('');
    setFormPrice(24999);
    setFormMrp(29999);
    setFormStock('in_stock');
    setFormStockQty(10);
    setFormWarranty('1 Year Manufacturer Warranty');
    setFormShortDesc('');
    setFormDesc('');
    setFormImages(['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80']);
    setFormSpecs({});
    setFormFestivalOffer(true);
    setFormIsFeatured(false);
    setFormIsBestseller(false);
    setFormIsNew(true);
    setProductModalOpen(true);
  };

  // Open Modal for Edit
  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormCategory(prod.category);
    setFormSubcategory(prod.subcategory || '');
    setFormModel(prod.model || '');
    setFormPrice(prod.price);
    setFormMrp(prod.mrp || prod.price);
    setFormStock(prod.stock);
    setFormStockQty(prod.stockQuantity || 10);
    setFormWarranty(prod.warranty || '1 Year Manufacturer Warranty');
    setFormShortDesc(prod.shortDescription || '');
    setFormDesc(prod.description || '');
    setFormImages(prod.images && prod.images.length ? prod.images : ['']);
    setFormSpecs(prod.specifications || {});
    setFormFestivalOffer(Boolean(prod.festivalOffer));
    setFormIsFeatured(Boolean(prod.isFeatured));
    setFormIsBestseller(Boolean(prod.isBestseller));
    setFormIsNew(Boolean(prod.isNew));
    setProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      alert('Product name and price are required');
      return;
    }

    const payload = {
      name: formName.trim(),
      brand: formBrand.trim(),
      category: formCategory,
      subcategory: formSubcategory,
      model: formModel.trim() || formName.trim(),
      price: Number(formPrice),
      mrp: Number(formMrp || formPrice),
      stock: formStock,
      stockQuantity: Number(formStockQty),
      warranty: formWarranty.trim(),
      shortDescription: formShortDesc.trim(),
      description: formDesc.trim(),
      images: formImages.filter((img) => img.trim().length > 0),
      specifications: formSpecs,
      festivalOffer: formFestivalOffer,
      isFeatured: formIsFeatured,
      isBestseller: formIsBestseller,
      isNew: formIsNew,
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          showToast(`Product "${updated.name}" updated successfully!`);
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setProducts((prev) => [created, ...prev]);
          showToast(`New product "${created.name}" created!`);
        }
      }

      setProductModalOpen(false);
      refreshData();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    }
  };

  // Toggle Stock directly
  const handleToggleStock = async (prod: Product, newStock: StockStatus) => {
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, stock: newStock } : p))
        );
        showToast(`Stock updated to ${newStock.replace(/_/g, ' ')}`);
        refreshData();
      }
    } catch (e) {
      console.error('Failed to toggle stock:', e);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Product "${name}" deleted`);
        refreshData();
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: `Status updated by Owner to ${newStatus}` }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        showToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        showToast('Store contact and showroom settings updated!');
        refreshData();
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  // Save Campaign
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/campaign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      if (res.ok) {
        const updated = await res.json();
        setCampaign(updated);
        showToast('Durga Puja Festival Campaign settings updated!');
        refreshData();
      }
    } catch (e) {
      console.error('Failed to save campaign:', e);
    }
  };

  // Dynamic spec field definition
  const currentCategorySpecs = CATEGORY_SPECS[formCategory] || [
    { label: 'Feature / Spec 1', key: 'spec_1', placeholder: 'e.g. Wattage / Material' },
    { label: 'Feature / Spec 2', key: 'spec_2', placeholder: 'e.g. Dimension / Capacity' },
  ];

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-gray-600">Loading Owner Management Dashboard...</p>
        </div>
      </div>
    );
  }

  // Filtered products inside admin table
  const displayedProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered orders inside admin table
  const displayedOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesDelivery = orderDeliveryFilter === 'all' || o.deliveryMethod === orderDeliveryFilter;
    return matchesStatus && matchesDelivery;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-sm">
              👑
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-gray-900 tracking-tight leading-none">
                Owner Dashboard
              </h1>
              <span className="text-[11px] text-gray-500 font-medium">{settings.storeName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-700 text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-2 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-2 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-brand-600 text-brand-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Products ({totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-2 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-brand-600 text-brand-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({totalOrders})</span>
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('campaign')}
            className={`py-3 px-2 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'campaign'
                ? 'border-brand-600 text-brand-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-festive-red" />
            <span>Durga Puja Sale</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-2 border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-brand-600 text-brand-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Total Products
                </span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">
                  {totalProducts}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {inStockProducts} In Stock • {outOfStockProducts} Out of Stock
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Total Orders
                </span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 block">
                  {totalOrders}
                </span>
                <span className="text-[11px] text-amber-700 font-semibold">
                  {pendingOrders} Pending Fulfillment
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Sales Volume
                </span>
                <span className="text-xl sm:text-2xl font-black text-brand-700 mt-1 block truncate">
                  {formatINR(totalRevenue)}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold">
                  From {completedOrders} Completed Orders
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Durga Puja Campaign
                </span>
                <span className="text-sm sm:text-base font-black text-gray-900 mt-1 flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      campaign.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  ></span>
                  <span>{campaign.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {campaign.discountPercentage}% Promotional Offer
                </span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-700 mr-2">Quick Actions:</span>
              <button
                onClick={openNewProductModal}
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Recent Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('campaign')}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-200"
              >
                <Sparkles className="w-4 h-4 text-festive-red" />
                <span>Configure Durga Puja Offer</span>
              </button>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 font-mono">
                          {order.orderNumber}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-gray-800">{order.customerName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 font-mono">{order.customerPhone}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
                        <span>{order.items.length} Items</span>
                        <span>•</span>
                        <span>Method: {order.deliveryMethod === 'store_pickup' ? 'Store Pickup' : 'Home Delivery'}</span>
                        <span>•</span>
                        <span className="font-bold text-gray-900">{formatINR(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full font-bold uppercase text-[10px] bg-amber-100 text-amber-900">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: MANAGE PRODUCTS ===================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, brand, SKU..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium"
                >
                  <option value="all">All Departments</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="tvs">Televisions</option>
                  <option value="refrigerators">Refrigerators</option>
                  <option value="air-conditioners">Air Conditioners</option>
                  <option value="washing-machines">Washing Machines</option>
                  <option value="audio">Audio & Earbuds</option>
                  <option value="laptops">Laptops & Tablets</option>
                  <option value="kitchen-appliances">Kitchen Appliances</option>
                  <option value="electricals">Electricals</option>
                </select>
              </div>

              <button
                onClick={openNewProductModal}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price / MRP</th>
                      <th className="py-3 px-3">Stock Status</th>
                      <th className="py-3 px-3">Festival Offer</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl p-1 shrink-0 border border-gray-100">
                            <SafeImage src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              {p.brand} • {p.sku}
                            </span>
                            <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 capitalize text-gray-600 font-medium">
                          {p.category.replace('-', ' ')}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 block">{formatINR(p.price)}</span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatINR(p.mrp)}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={p.stock}
                            onChange={(e) => handleToggleStock(p, e.target.value as StockStatus)}
                            className={`p-1 rounded-lg text-[11px] font-bold border ${
                              p.stock === 'in_stock'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : p.stock === 'limited_stock'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                          >
                            <option value="in_stock">In Stock</option>
                            <option value="limited_stock">Limited Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                          </select>
                        </td>

                        <td className="py-3 px-3">
                          {p.festivalOffer ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                              Active (20%)
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px]">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-orange-50"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: MANAGE ORDERS ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Orders Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-700">Filter Orders:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={orderDeliveryFilter}
                onChange={(e) => setOrderDeliveryFilter(e.target.value)}
                className="p-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-medium"
              >
                <option value="all">All Delivery Modes</option>
                <option value="home_delivery">Home Delivery</option>
                <option value="store_pickup">Store Pickup</option>
              </select>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {displayedOrders.map((order) => {
                const customerWhatsAppMsg = generateCustomerOrderWhatsAppMessage(
                  settings.storeName,
                  order.orderNumber,
                  order.customerName,
                  order.totalAmount,
                  order.deliveryMethod
                );
                const whatsappUrl = generateWhatsAppUrl(order.customerPhone, customerWhatsAppMsg);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                      <div>
                        <span className="font-bold text-base text-gray-900 font-mono">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-gray-400 block text-[11px] mt-0.5">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Change Status Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500 font-medium text-[11px]">Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="p-1.5 rounded-xl border border-brand-300 bg-orange-50/50 text-brand-900 font-bold text-xs"
                          >
                            <option value="new">New Order</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing Package</option>
                            <option value="ready_for_pickup">Ready for Store Pickup</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="completed">Completed / Handed Over</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Fulfillment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Details & Contact Actions */}
                      <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                        <span className="font-bold text-gray-400 uppercase text-[10px] block">
                          Customer
                        </span>
                        <div className="font-bold text-sm text-gray-900">{order.customerName}</div>
                        <div className="text-gray-600 font-mono">Phone: {order.customerPhone}</div>
                        {order.customerEmail && <div className="text-gray-500">{order.customerEmail}</div>}

                        {/* ONE-TAP CALL & WHATSAPP ACTIONS */}
                        <div className="pt-2 flex items-center gap-2">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 font-bold text-xs flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Customer</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Fulfillment Mode */}
                      <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                        <span className="font-bold text-gray-400 uppercase text-[10px] block">
                          Fulfillment Mode
                        </span>
                        <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          {order.deliveryMethod === 'store_pickup' ? (
                            <>
                              <Store className="w-4 h-4 text-brand-600" />
                              <span>Store Pickup (Free)</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-4 h-4 text-emerald-600" />
                              <span>Home Delivery</span>
                            </>
                          )}
                        </div>

                        {order.deliveryMethod === 'home_delivery' ? (
                          <div className="text-gray-600 text-[11px] pt-1">
                            <p>{order.deliveryAddress?.address}</p>
                            <p>
                              {order.deliveryAddress?.area}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                            </p>
                          </div>
                        ) : (
                          <div className="text-gray-600 text-[11px] pt-1">
                            <p>Customer will collect at showroom</p>
                            <p>Preferred time: {order.pickupDetails?.pickupTime}</p>
                          </div>
                        )}
                      </div>

                      {/* Payment & Amount */}
                      <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                        <span className="font-bold text-gray-400 uppercase text-[10px] block">
                          Total & Payment
                        </span>
                        <div className="font-black text-lg text-brand-700">
                          {formatINR(order.totalAmount)}
                        </div>
                        <div className="text-[11px] text-gray-600">
                          Mode: <span className="font-bold uppercase">{order.paymentMethod.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Status: <span className="capitalize font-semibold">{order.paymentStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                        Products ({order.items.length}):
                      </span>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-gray-800">
                              {item.quantity}x <strong>{item.productName}</strong> ({item.brand})
                            </span>
                            <span className="font-bold text-gray-900 font-mono">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: FESTIVAL CAMPAIGN ===================== */}
        {activeTab === 'campaign' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Durga Puja Mega Electronics Sale</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Campaign & Offer Configuration
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Update festival marketing copy, banner text, discount percentage, and activate or pause without touching code.
              </p>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div>
                  <span className="font-bold text-amber-950 block text-sm">Campaign Active Status</span>
                  <span className="text-[11px] text-amber-800">
                    When active, festival hero banners, badges, and discounts appear across the storefront.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={campaign.isActive}
                  onChange={(e) => setCampaign({ ...campaign, isActive: e.target.checked })}
                  className="w-5 h-5 accent-brand-600 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={campaign.title}
                  onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Promotional Tagline / Offer Claim</label>
                <input
                  type="text"
                  value={campaign.tagline}
                  onChange={(e) => setCampaign({ ...campaign, tagline: e.target.value })}
                  placeholder="e.g. Buy Before Durga Puja & Save Up To 20%"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Promotional Offer Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={campaign.discountPercentage}
                  onChange={(e) => setCampaign({ ...campaign, discountPercentage: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Description</label>
                <textarea
                  rows={3}
                  value={campaign.description}
                  onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sale Start Date</label>
                  <input
                    type="date"
                    value={campaign.startDate ? campaign.startDate.slice(0, 10) : ''}
                    onChange={(e) => setCampaign({ ...campaign, startDate: new Date(e.target.value).toISOString() })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sale End Date (Countdown Target)</label>
                  <input
                    type="date"
                    value={campaign.endDate ? campaign.endDate.slice(0, 10) : ''}
                    onChange={(e) => setCampaign({ ...campaign, endDate: new Date(e.target.value).toISOString() })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Festival Campaign</span>
              </button>
            </form>
          </div>
        )}

        {/* ===================== TAB 5: STORE CONTACT & SETTINGS ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Store Profile & Contact Settings
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Central settings used across the entire website for Call Store, WhatsApp buttons, pickup address, and Google Maps directions.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Store Phone Number (For Direct Calling)
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Store WhatsApp Number (For Product Enquiries)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Showroom Physical Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={settings.state}
                    onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={settings.pincode}
                    onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Google Maps Direction URL</label>
                <input
                  type="text"
                  value={settings.googleMapsUrl}
                  onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Showroom Opening Hours</label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    value={settings.freeDeliveryAbove}
                    onChange={(e) => setSettings({ ...settings, freeDeliveryAbove: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Standard Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Settings</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ===================== MODAL: ADD / EDIT PRODUCT ===================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-black text-base text-gray-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department / Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="mobiles">Smartphones & Mobiles</option>
                    <option value="tvs">Televisions (Smart TVs)</option>
                    <option value="refrigerators">Refrigerators</option>
                    <option value="air-conditioners">Air Conditioners</option>
                    <option value="washing-machines">Washing Machines</option>
                    <option value="audio">Audio & Wearables</option>
                    <option value="laptops">Laptops & Tablets</option>
                    <option value="kitchen-appliances">Kitchen Appliances</option>
                    <option value="electricals">Electricals & Smart Home</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Samsung, Apple, LG, Voltas"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="e.g. Flagship Smartphones"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Model Number</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. Galaxy S24 Ultra"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-mono text-gray-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Status</label>
                  <select
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value as StockStatus)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-semibold"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="limited_stock">Limited Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formStockQty}
                    onChange={(e) => setFormStockQty(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Product Images Management */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Image URLs (Primary image is first)
                </label>
                {formImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const next = [...formImages];
                        next[idx] = e.target.value;
                        setFormImages(next);
                      }}
                      placeholder="https://... image URL"
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
                    />
                    {formImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormImages([...formImages, ''])}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Image URL</span>
                </button>
              </div>

              {/* Dynamic Specifications based on Category */}
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200/60 space-y-3">
                <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">
                  {formCategory.toUpperCase()} Specifications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentCategorySpecs.map((spec) => (
                    <div key={spec.key}>
                      <label className="block font-semibold text-gray-700 mb-0.5">{spec.label}</label>
                      <input
                        type="text"
                        value={formSpecs[spec.key] || ''}
                        onChange={(e) =>
                          setFormSpecs({
                            ...formSpecs,
                            [spec.key]: e.target.value,
                          })
                        }
                        placeholder={spec.placeholder}
                        className="w-full p-2 bg-white border border-gray-200 rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Description (Key Highlight)</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="e.g. Galaxy AI with 200MP Quad Telephoto Camera and Titanium frame."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formFestivalOffer}
                    onChange={(e) => setFormFestivalOffer(e.target.checked)}
                    className="accent-brand-600 w-4 h-4"
                  />
                  <span>Eligible for Durga Puja Offer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-brand-600 w-4 h-4"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="accent-brand-600 w-4 h-4"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/25"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
