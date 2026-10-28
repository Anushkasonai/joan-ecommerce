'use server';

import { cookies } from 'next/headers';
import { getCurrentUser } from '../auth';
import { getCart, saveCart, getWishlist, toggleWishlist, getDb, saveDb } from '../db';
import { revalidatePath } from 'next/cache';

// Helper to get guest cart from cookies
export async function getGuestCart(): Promise<{ productId: string; quantity: number }[]> {
  const cookieStore = await cookies();
  const guestCartCookie = cookieStore.get('guest_cart')?.value;
  if (!guestCartCookie) return [];
  try {
    return JSON.parse(guestCartCookie);
  } catch (e) {
    return [];
  }
}

// Helper to save guest cart to cookies
async function saveGuestCart(items: { productId: string; quantity: number }[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('guest_cart', JSON.stringify(items), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

// Helper to get guest wishlist from cookies
export async function getGuestWishlist(): Promise<string[]> {
  const cookieStore = await cookies();
  const guestWishlistCookie = cookieStore.get('guest_wishlist')?.value;
  if (!guestWishlistCookie) return [];
  try {
    return JSON.parse(guestWishlistCookie);
  } catch (e) {
    return [];
  }
}

// Helper to save guest wishlist to cookies
async function saveGuestWishlist(items: string[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('guest_wishlist', JSON.stringify(items), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export async function addToCartAction(productId: string, quantity: number = 1) {
  const user = await getCurrentUser();
  
  if (user) {
    const items = getCart(user.id);
    const existingIndex = items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    saveCart(user.id, items);
  } else {
    const items = await getGuestCart();
    const existingIndex = items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    await saveGuestCart(items);
  }
  
  revalidatePath('/');
  revalidatePath('/cart');
  return { success: true };
}

export async function removeFromCartAction(productId: string) {
  const user = await getCurrentUser();
  
  if (user) {
    let items = getCart(user.id);
    items = items.filter(item => item.productId !== productId);
    saveCart(user.id, items);
  } else {
    let items = await getGuestCart();
    items = items.filter(item => item.productId !== productId);
    await saveGuestCart(items);
  }
  
  revalidatePath('/');
  revalidatePath('/cart');
  return { success: true };
}

export async function updateCartQtyAction(productId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCartAction(productId);
  }
  
  const user = await getCurrentUser();
  
  if (user) {
    const items = getCart(user.id);
    const existingIndex = items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      items[existingIndex].quantity = quantity;
      saveCart(user.id, items);
    }
  } else {
    const items = await getGuestCart();
    const existingIndex = items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      items[existingIndex].quantity = quantity;
      await saveGuestCart(items);
    }
  }
  
  revalidatePath('/cart');
  return { success: true };
}

export async function toggleWishlistAction(productId: string) {
  const user = await getCurrentUser();
  let activeWishlist: string[] = [];
  
  if (user) {
    activeWishlist = toggleWishlist(user.id, productId);
  } else {
    const list = await getGuestWishlist();
    const idx = list.indexOf(productId);
    if (idx === -1) {
      list.push(productId);
    } else {
      list.splice(idx, 1);
    }
    await saveGuestWishlist(list);
    activeWishlist = list;
  }
  
  revalidatePath('/');
  revalidatePath('/wishlist');
  return { success: true, wishlist: activeWishlist };
}

// Function to fetch cart items for rendering
export async function getCartItems() {
  const user = await getCurrentUser();
  if (user) {
    return getCart(user.id);
  } else {
    return await getGuestCart();
  }
}

// Function to fetch wishlist items for rendering
export async function getWishlistItems() {
  const user = await getCurrentUser();
  if (user) {
    return getWishlist(user.id);
  } else {
    return await getGuestWishlist();
  }
}

// Merge guest cart/wishlist to logged in user cart/wishlist
export async function syncGuestData(userId: string) {
  const cookieStore = await cookies();

  // Sync cart
  const guestCart = await getGuestCart();
  if (guestCart.length > 0) {
    const userCart = getCart(userId);
    guestCart.forEach(gItem => {
      const uIndex = userCart.findIndex(uItem => uItem.productId === gItem.productId);
      if (uIndex > -1) {
        userCart[uIndex].quantity += gItem.quantity;
      } else {
        userCart.push(gItem);
      }
    });
    saveCart(userId, userCart);
    cookieStore.delete('guest_cart');
  }

  // Sync wishlist
  const guestWishlist = await getGuestWishlist();
  if (guestWishlist.length > 0) {
    const userWishlist = getWishlist(userId);
    guestWishlist.forEach(pId => {
      if (!userWishlist.includes(pId)) {
        userWishlist.push(pId);
      }
    });
    const db = getDb();
    db.wishlists[userId] = userWishlist;
    saveDb(db);
    cookieStore.delete('guest_wishlist');
  }
}
