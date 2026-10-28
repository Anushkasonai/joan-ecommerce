'use client';

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { addToCartAction, updateCartQtyAction, removeFromCartAction, toggleWishlistAction } from '@/lib/actions/cartActions';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  wishlistCount: number;
  getItemQty: (productId: string) => number;
  isWishlisted: (productId: string) => boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialCart = [],
  initialWishlist = [],
}: {
  children: React.ReactNode;
  initialCart?: CartItem[];
  initialWishlist?: string[];
}) {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [wishlist, setWishlist] = useState<string[]>(initialWishlist);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  useEffect(() => {
    setWishlist(initialWishlist);
  }, [initialWishlist]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const getItemQty = (productId: string): number => {
    const item = cart.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const isWishlisted = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    // Optimistic state update
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { productId, quantity }];
    });

    startTransition(async () => {
      try {
        await addToCartAction(productId, quantity);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    });
  };

  const updateQty = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );

    startTransition(async () => {
      try {
        await updateCartQtyAction(productId, quantity);
      } catch (err) {
        console.error('Failed to update cart quantity:', err);
      }
    });
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));

    startTransition(async () => {
      try {
        await removeFromCartAction(productId);
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      }
    });
  };

  const toggleWishlist = async (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });

    startTransition(async () => {
      try {
        const res = await toggleWishlistAction(productId);
        if (res && res.wishlist) {
          setWishlist(res.wishlist);
        }
      } catch (err) {
        console.error('Failed to toggle wishlist:', err);
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        getItemQty,
        isWishlisted,
        addToCart,
        updateQty,
        removeFromCart,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

