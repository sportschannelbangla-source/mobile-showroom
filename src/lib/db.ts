import fs from 'fs';
import path from 'path';
import { Product, Category, StoreSettings, FestivalCampaign, Order, OrderStatus } from './types';
import {
  SEED_PRODUCTS,
  SEED_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_CAMPAIGN,
  INITIAL_ORDERS,
} from '@/data/seed-data';

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  campaign: FestivalCampaign;
  orders: Order[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

// Ensure db exists and return loaded data
export function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      const initialDb: DatabaseSchema = {
        products: SEED_PRODUCTS,
        categories: SEED_CATEGORIES,
        settings: INITIAL_SETTINGS,
        campaign: INITIAL_CAMPAIGN,
        orders: INITIAL_ORDERS,
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }

    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error('Error reading database, falling back to seed data:', error);
    return {
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      settings: INITIAL_SETTINGS,
      campaign: INITIAL_CAMPAIGN,
      orders: INITIAL_ORDERS,
    };
  }
}

// Atomically save data to disk
export function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (error) {
    console.error('Error saving database:', error);
    throw error;
  }
}

// PRODUCT REPOSITORY
export function getAllProducts(): Product[] {
  const db = getDatabase();
  return db.products;
}

export function getProductById(id: string): Product | undefined {
  const db = getDatabase();
  return db.products.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
}

export function filterProducts(options: {
  category?: string;
  brand?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  stock?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}): { products: Product[]; total: number } {
  let list = getAllProducts();

  if (options.category && options.category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }

  if (options.brand && options.brand !== 'all') {
    list = list.filter((p) => p.brand.toLowerCase() === options.brand?.toLowerCase());
  }

  if (options.query && options.query.trim()) {
    const q = options.query.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (options.minPrice !== undefined && !isNaN(options.minPrice)) {
    list = list.filter((p) => p.price >= (options.minPrice || 0));
  }

  if (options.maxPrice !== undefined && !isNaN(options.maxPrice)) {
    list = list.filter((p) => p.price <= (options.maxPrice || Infinity));
  }

  if (options.stock) {
    list = list.filter((p) => p.stock === options.stock);
  }

  // Sorting
  if (options.sortBy === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sortBy === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (options.sortBy === 'discount') {
    list.sort((a, b) => b.discount - a.discount);
  } else if (options.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (options.sortBy === 'newest') {
    list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else {
    // Default: Featured first, then bestsellers
    list.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }

  const total = list.length;
  if (options.offset || options.limit) {
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : undefined;
    list = list.slice(start, end);
  }

  return { products: list, total };
}

export function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sku'>): Product {
  const db = getDatabase();
  const newId = `prod-${Date.now()}`;
  const brandCode = productData.brand.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'SBE';
  const catCode = productData.category.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'GEN';
  const sku = `${brandCode}-${catCode}-${Math.floor(1000 + Math.random() * 9000)}`;

  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    id: newId,
    sku,
    discount: productData.mrp > productData.price ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100) : 0,
    createdAt: now,
    updatedAt: now,
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = getDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = db.products[index];
  const updatedPrice = updates.price !== undefined ? updates.price : current.price;
  const updatedMrp = updates.mrp !== undefined ? updates.mrp : current.mrp;
  const calculatedDiscount = updatedMrp > updatedPrice ? Math.round(((updatedMrp - updatedPrice) / updatedMrp) * 100) : 0;

  const updatedProduct: Product = {
    ...current,
    ...updates,
    price: updatedPrice,
    mrp: updatedMrp,
    discount: calculatedDiscount,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updatedProduct;
  saveDatabase(db);
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const db = getDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  db.products.splice(index, 1);
  saveDatabase(db);
  return true;
}

// CATEGORIES REPOSITORY
export function getAllCategories(): Category[] {
  const db = getDatabase();
  return db.categories;
}

// ORDERS REPOSITORY
export function getAllOrders(): Order[] {
  const db = getDatabase();
  return db.orders;
}

export function getOrderById(id: string): Order | undefined {
  const db = getDatabase();
  return db.orders.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
}

export function createOrder(
  orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>
): Order {
  const db = getDatabase();
  const id = `ord-${Date.now()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SBE-2026-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderInput,
    id,
    orderNumber,
    statusHistory: [
      {
        status: orderInput.status || 'new',
        timestamp: now,
        note:
          orderInput.deliveryMethod === 'store_pickup'
            ? 'Order reserved for Store Pickup'
            : 'Order placed for Home Delivery',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus, note?: string): Order | null {
  const db = getDatabase();
  const index = db.orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = db.orders[index];

  current.status = status;
  current.updatedAt = now;
  current.statusHistory.push({
    status,
    timestamp: now,
    note: note || `Status updated to ${status}`,
  });

  db.orders[index] = current;
  saveDatabase(db);
  return current;
}

// SETTINGS REPOSITORY
export function getStoreSettings(): StoreSettings {
  const db = getDatabase();
  return db.settings;
}

export function updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  const db = getDatabase();
  db.settings = { ...db.settings, ...settings };
  saveDatabase(db);
  return db.settings;
}

// CAMPAIGN REPOSITORY
export function getFestivalCampaign(): FestivalCampaign {
  const db = getDatabase();
  return db.campaign;
}

export function updateFestivalCampaign(campaign: Partial<FestivalCampaign>): FestivalCampaign {
  const db = getDatabase();
  db.campaign = { ...db.campaign, ...campaign };
  saveDatabase(db);
  return db.campaign;
}
