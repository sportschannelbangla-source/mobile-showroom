'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';
import { useStore } from './StoreContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  mrpTotal: number;
  subtotal: number;
  festivalDiscountAmount: number;
  savingsTotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  mrpTotal: 0,
  subtotal: 0,
  festivalDiscountAmount: 0,
  savingsTotal: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { campaign } = useStore();

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sbe_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sbe_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Error saving cart to localStorage:', e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const mrpTotal = cart.reduce(
    (sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // If festival campaign is active, calculate additional festive savings for eligible products
  const festivalDiscountAmount = cart.reduce((sum, item) => {
    if (
      campaign.isActive &&
      item.product.festivalOffer &&
      campaign.discountPercentage > 0
    ) {
      // Calculate promotional festival benefit (e.g. 5% extra or difference)
      const extraSaving = Math.round(item.product.price * 0.05) * item.quantity;
      return sum + extraSaving;
    }
    return sum;
  }, 0);

  const savingsTotal = mrpTotal - (subtotal - festivalDiscountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        mrpTotal,
        subtotal,
        festivalDiscountAmount,
        savingsTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
