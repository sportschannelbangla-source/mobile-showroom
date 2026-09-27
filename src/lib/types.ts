export type StockStatus = 'in_stock' | 'out_of_stock' | 'limited_stock';

export type DeliveryMethod = 'home_delivery' | 'store_pickup';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  model: string;
  images: string[];
  price: number;
  mrp: number;
  discount: number;
  festivalOffer: boolean;
  festivalDiscount?: number;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  stock: StockStatus;
  stockQuantity: number;
  sku: string;
  warranty: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  subcategories: string[];
  brands: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  categories: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: {
    address: string;
    area?: string;
    city: string;
    pincode: string;
    instructions?: string;
  };
  pickupDetails?: {
    storeName: string;
    storeAddress: string;
    pickupTime?: string;
  };
  items: OrderItem[];
  mrpTotal: number;
  subtotal: number;
  festivalDiscountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'pay_at_store' | 'upi_on_delivery' | 'online_simulated';
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  openingHours: string;
  homeDeliveryAvailable: boolean;
  storePickupAvailable: boolean;
  freeDeliveryAbove: number;
  deliveryFee: number;
  currencySymbol: string;
}

export interface FestivalCampaign {
  id: string;
  title: string;
  tagline: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage: string;
  eligibleCategories: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
