'use server';

import { getCurrentUser } from '../auth';
import { addOrder, getCart, saveCart, getProductById, updateProduct, getDb, saveDb } from '../db';
import { revalidatePath } from 'next/cache';

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export async function createOrderAction(address: Address, paymentMethod: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: 'Please login to checkout.' };
  }
  
  const cartItems = getCart(user.id);
  if (cartItems.length === 0) {
    return { error: 'Your cart is empty.' };
  }
  
  // Build full order items (with prices, images, titles, and verify stock)
  const items = [];
  let totalAmount = 0;
  
  for (const item of cartItems) {
    const product = getProductById(item.productId);
    if (!product) {
      return { error: `Product not found: ${item.productId}` };
    }
    if (product.stock < item.quantity) {
      return { error: `Insufficient stock for product: ${product.name}. Only ${product.stock} items left.` };
    }
    items.push({
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image
    });
    totalAmount += product.price * item.quantity;
  }
  
  // Deduct stock
  for (const item of cartItems) {
    const product = getProductById(item.productId)!;
    updateProduct(item.productId, { stock: product.stock - item.quantity });
  }
  
  // Create order in 'pending' status
  const order = addOrder({
    userId: user.id,
    items,
    deliveryAddress: address,
    paymentStatus: 'pending',
    orderStatus: 'ordered',
    paymentMethod,
    totalAmount
  });
  
  // Clear cart
  saveCart(user.id, []);
  
  revalidatePath('/cart');
  revalidatePath('/orders');
  
  return { success: true, orderId: order.id, totalAmount: order.totalAmount };
}

export async function simulatePaymentAction(orderId: string, paymentDetails: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    return { error: 'Order not found' };
  }
  
  order.paymentStatus = 'paid';
  order.orderStatus = 'paid';
  order.paymentDetails = paymentDetails;
  
  saveDb(db);
  revalidatePath('/orders');
  return { success: true };
}
