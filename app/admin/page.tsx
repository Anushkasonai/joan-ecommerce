import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { getProducts, getOrders, getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  // Security guard: restrict access to admin role only
  if (!user || user.role !== 'admin') {
    redirect('/auth/login');
  }

  const products = getProducts();
  const orders = getOrders();
  const dbData = getDb();
  
  // Strip passwords for safety before passing to client components
  const sanitizedUsers = dbData.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-[#E9E1F5] pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#292633]">Joan Admin Console</h1>
        <p className="text-xs text-[#77717F] mt-1">Manage product catalog parameters, review customer orders, and maintain registries.</p>
      </div>

      <AdminDashboard 
        products={products as any} 
        orders={orders} 
        users={sanitizedUsers} 
        currentUserId={user.id} 
      />
    </div>
  );
}
