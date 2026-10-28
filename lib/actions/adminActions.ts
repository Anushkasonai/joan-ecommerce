'use server';

import { getCurrentUser } from '../auth';
import { addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteUser, addProductReview } from '../db';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

export async function addProductAction(formData: FormData) {
  try {
    await checkAdmin();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPrice = parseFloat(formData.get('originalPrice') as string);
    const category = formData.get('category') as string;
    const image = formData.get('image') as string;
    const stock = parseInt(formData.get('stock') as string, 10);
    const featured = formData.get('featured') === 'true';

    // Build specs from specs JSON string
    const specsStr = formData.get('specs') as string;
    let specs = {};
    if (specsStr) {
      try {
        specs = JSON.parse(specsStr);
      } catch (e) {
        specs = {};
      }
    }

    if (!name || !price || !category || !image || isNaN(price) || isNaN(stock)) {
      return { error: 'Invalid inputs. Name, price, category, image and stock are required.' };
    }

    const newProduct = addProduct({
      name,
      description,
      price,
      originalPrice: isNaN(originalPrice) ? price : originalPrice,
      category,
      image,
      specs,
      stock,
      featured
    });

    revalidatePath('/');
    revalidatePath('/search');
    return { success: true, product: newProduct };
  } catch (error: any) {
    return { error: error.message || 'Failed to add product' };
  }
}

export async function updateProductAction(productId: string, formData: FormData) {
  try {
    await checkAdmin();
    const name = formData.get('name') as string || undefined;
    const description = formData.get('description') as string || undefined;
    const priceStr = formData.get('price') as string;
    const originalPriceStr = formData.get('originalPrice') as string;
    const category = formData.get('category') as string || undefined;
    const image = formData.get('image') as string || undefined;
    const stockStr = formData.get('stock') as string;
    const featuredStr = formData.get('featured') as string;

    const price = priceStr ? parseFloat(priceStr) : undefined;
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : undefined;
    const stock = stockStr ? parseInt(stockStr, 10) : undefined;
    const featured = featuredStr ? featuredStr === 'true' : undefined;

    const specsStr = formData.get('specs') as string;
    let specs = undefined;
    if (specsStr) {
      try {
        specs = JSON.parse(specsStr);
      } catch (e) {
        // ignore
      }
    }

    const updated = updateProduct(productId, {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price }),
      ...(originalPrice !== undefined && { originalPrice }),
      ...(category && { category }),
      ...(image && { image }),
      ...(stock !== undefined && { stock }),
      ...(featured !== undefined && { featured }),
      ...(specs && { specs })
    });

    if (!updated) {
      return { error: 'Product not found.' };
    }

    revalidatePath('/');
    revalidatePath('/search');
    revalidatePath(`/products/${productId}`);
    return { success: true, product: updated };
  } catch (error: any) {
    return { error: error.message || 'Failed to update product' };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await checkAdmin();
    const success = deleteProduct(productId);
    if (!success) {
      return { error: 'Product not found.' };
    }
    revalidatePath('/');
    revalidatePath('/search');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete product' };
  }
}

export async function updateOrderStatusAction(orderId: string, status: any) {
  try {
    await checkAdmin();
    const updated = updateOrderStatus(orderId, status);
    if (!updated) {
      return { error: 'Order not found.' };
    }
    revalidatePath('/orders');
    return { success: true, order: updated };
  } catch (error: any) {
    return { error: error.message || 'Failed to update order status' };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await checkAdmin();
    // Do not delete oneself
    const currentUser = await getCurrentUser();
    if (currentUser?.id === userId) {
      return { error: 'Cannot delete your own admin account.' };
    }

    const success = deleteUser(userId);
    if (!success) {
      return { error: 'User not found.' };
    }
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete user' };
  }
}

export async function addReviewAction(productId: string, rating: number, comment: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Please login to submit a review.' };
    }
    if (!rating || rating < 1 || rating > 5 || !comment) {
      return { error: 'Rating (1-5) and comment are required.' };
    }

    const updatedProduct = addProductReview(productId, user.name, rating, comment);
    if (!updatedProduct) {
      return { error: 'Product not found.' };
    }

    revalidatePath(`/products/${productId}`);
    return { success: true, product: updatedProduct };
  } catch (error: any) {
    return { error: error.message || 'Failed to add review' };
  }
}
