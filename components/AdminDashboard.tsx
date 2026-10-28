'use client';

import React, { useState, useTransition } from 'react';
import { 
  BarChart3, Plus, Trash2, Edit, Check, X, Shield, 
  Package, ShoppingCart, Users, BadgeAlert, Sparkles, Upload, Loader2, ArrowRight
} from 'lucide-react';
import { 
  addProductAction, updateProductAction, deleteProductAction, 
  updateOrderStatusAction, deleteUserAction 
} from '@/lib/actions/adminActions';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  specs: Record<string, string>;
}

interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  deliveryAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'ordered' | 'paid' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  users: User[];
  currentUserId: string;
}

type TabType = 'overview' | 'products' | 'orders' | 'users';

const CATEGORIES = [
  "Women's fashion",
  "Men's fashion",
  "Bags and accessories",
  "Beauty and personal care",
  "Electronics and mobile accessories",
  "Home and kitchen",
  "Grocery and daily essentials",
  "Footwear"
];

export default function AdminDashboard({ products, orders, users, currentUserId }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isPending, startTransition] = useTransition();

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOrigPrice, setFormOrigPrice] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formImage, setFormImage] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSpecs, setFormSpecs] = useState('{}');
  const [formError, setFormError] = useState('');

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormDesc(product.description || '');
    setFormPrice(product.price.toString());
    setFormOrigPrice(product.originalPrice.toString());
    setFormCategory(product.category);
    setFormImage(product.image);
    setFormStock(product.stock.toString());
    setFormFeatured(product.featured);
    setFormSpecs(JSON.stringify(product.specs || {}, null, 2));
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProductId(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormOrigPrice('');
    setFormCategory(CATEGORIES[0]);
    setFormImage('');
    setFormStock('50');
    setFormFeatured(false);
    setFormSpecs(JSON.stringify({
      'Brand': 'Joan Curated',
      'Origin': 'India'
    }, null, 2));
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formCategory || !formImage || !formStock) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      JSON.parse(formSpecs);
    } catch (e) {
      setFormError('Invalid specs format. Must be a valid JSON object.');
      return;
    }

    setFormError('');

    const formData = new FormData();
    formData.append('name', formName);
    formData.append('description', formDesc);
    formData.append('price', formPrice);
    formData.append('originalPrice', formOrigPrice || formPrice);
    formData.append('category', formCategory);
    formData.append('image', formImage);
    formData.append('stock', formStock);
    formData.append('featured', formFeatured ? 'true' : 'false');
    formData.append('specs', formSpecs);

    startTransition(async () => {
      let res;
      if (editingProductId) {
        res = await updateProductAction(editingProductId, formData);
      } else {
        res = await addProductAction(formData);
      }

      if (res && res.error) {
        setFormError(res.error);
      } else {
        setIsFormOpen(false);
        setEditingProductId(null);
        router.refresh();
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res && res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleOrderStatusChange = (orderId: string, status: any) => {
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, status);
      if (res && res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleDeleteUser = (id: string) => {
    if (!confirm('Are you sure you want to delete this user profile?')) return;
    startTransition(async () => {
      const res = await deleteUserAction(id);
      if (res && res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  // Metrics
  const totalSales = orders
    .filter(o => o.paymentStatus === 'paid' && o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Tabs */}
      <div className="flex border-b border-[#E9E1F5] overflow-x-auto pb-px shrink-0 gap-6">
        {[
          { key: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
          { key: 'products', label: 'Product Inventory', icon: Package },
          { key: 'orders', label: 'Customer Orders', icon: ShoppingCart },
          { key: 'users', label: 'Registered Users', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as TabType);
                setIsFormOpen(false);
              }}
              className={`flex items-center gap-2 pb-3.5 px-1 font-bold text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === tab.key
                  ? 'border-[#7962B5] text-[#7962B5] font-extrabold'
                  : 'border-transparent text-[#77717F] hover:text-[#292633]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW PANEL */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Dashboard Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[#77717F]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales Volume</span>
                <Sparkles className="h-4 w-4 text-[#7962B5]" />
              </div>
              <p className="text-2xl font-bold text-[#292633]">{formatINR(totalSales)}</p>
              <p className="text-[11px] text-[#37866A] font-semibold">Live order revenue</p>
            </div>

            <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[#77717F]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Orders</span>
                <ShoppingCart className="h-4 w-4 text-[#7962B5]" />
              </div>
              <p className="text-2xl font-bold text-[#292633]">{pendingOrdersCount}</p>
              <p className="text-[11px] text-[#77717F]">In progress or out for delivery</p>
            </div>

            <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[#77717F]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Catalog Items</span>
                <Package className="h-4 w-4 text-[#7962B5]" />
              </div>
              <p className="text-2xl font-bold text-[#292633]">{products.length}</p>
              <p className="text-[11px] text-[#77717F]">Across 8 active categories</p>
            </div>

            <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[#77717F]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Registered Users</span>
                <Users className="h-4 w-4 text-[#7962B5]" />
              </div>
              <p className="text-2xl font-bold text-[#292633]">{users.length}</p>
              <p className="text-[11px] text-[#77717F]">Customer and admin profiles</p>
            </div>
          </div>

          {/* Catalog alarm flags */}
          {outOfStockCount > 0 && (
            <div className="border border-[#D94F70]/30 bg-[#F6DDE8]/40 p-4 rounded-2xl flex items-center gap-3 text-[#D94F70] text-xs">
              <BadgeAlert className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-bold">Inventory Alert:</span>
                <span className="ml-1 font-normal">{outOfStockCount} products are currently out of stock. Update catalog quantities to resume sales.</span>
              </div>
            </div>
          )}

          {/* Category Distribution Bar Chart */}
          <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl space-y-4 shadow-xs">
            <div>
              <h3 className="font-bold text-[#292633] text-sm uppercase tracking-wider">Products per Category</h3>
              <p className="text-xs text-[#77717F] mt-0.5">Distribution of products across Joan's 8 supported shopping departments.</p>
            </div>

            <div className="h-44 w-full bg-[#FFFCF7] rounded-2xl border border-[#E9E1F5] p-4 flex items-end gap-2 sm:gap-4 justify-center overflow-x-auto">
              {CATEGORIES.map((cat) => {
                const count = products.filter(p => p.category === cat).length;
                const percentage = Math.max(20, (count / Math.max(1, products.length)) * 100 * 2.5);
                return (
                  <div key={cat} className="flex-1 flex flex-col items-center gap-2 min-w-[50px] max-w-[80px]">
                    <span className="text-[10px] font-mono text-[#77717F] font-bold">{count}</span>
                    <div 
                      className="w-full bg-gradient-to-t from-[#7962B5] to-[#B9A7E8] rounded-t-lg shadow-xs"
                      style={{ height: `${percentage}%` }}
                    />
                    <span className="text-[9px] text-[#77717F] font-bold uppercase truncate w-full text-center" title={cat}>
                      {cat.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS PANEL */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header row */}
          {!isFormOpen && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Product Inventory ({products.length})</span>
              <button
                onClick={handleCreateClick}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#7962B5] hover:bg-[#654fa0] font-bold text-xs uppercase tracking-wider text-white shadow-xs transition-all"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </button>
            </div>
          )}

          {/* Form Overlay Editor */}
          {isFormOpen && (
            <div className="border border-[#E9E1F5] bg-white p-6 rounded-3xl space-y-6 max-w-2xl shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-[#E9E1F5]">
                <h3 className="font-bold text-[#292633] text-sm uppercase tracking-wider">
                  {editingProductId ? 'Edit Product Parameters' : 'Add New Product to Catalog'}
                </h3>
                <button onClick={() => setIsFormOpen(false)} className="text-[#77717F] hover:text-[#292633]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && <p className="text-xs text-[#D94F70] bg-[#F6DDE8]/40 border border-[#F6DDE8] p-2.5 rounded-xl">{formError}</p>}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Product Title*</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Floral Embroidered Cotton Kurta"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Category*</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Selling Price (₹)*</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 899"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1399"
                      value={formOrigPrice}
                      onChange={(e) => setFormOrigPrice(e.target.value)}
                      className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Stock Quantity*</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Image URL (Unsplash or CDN)*</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed description of the product..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-[#292633] focus:outline-none focus:border-[#7962B5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#77717F] uppercase tracking-wider mb-1">Specifications (JSON Object)</label>
                  <textarea
                    rows={3}
                    placeholder='{ "Fabric": "100% Cotton", "Origin": "Jaipur" }'
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    className="w-full font-mono bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-3.5 py-2 text-xs text-[#292633] focus:outline-none focus:border-[#7962B5]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-[#7962B5] focus:ring-[#7962B5]"
                  />
                  <label htmlFor="featured" className="font-semibold text-xs text-[#292633]">
                    Display in Recommended / Featured Section on Homepage
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E9E1F5]">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2 rounded-full border border-[#E9E1F5] font-semibold text-xs text-[#77717F] hover:bg-[#FFFCF7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 rounded-full bg-[#7962B5] hover:bg-[#654fa0] text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                  >
                    {isPending ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Listing Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E9E1F5] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#292633]">
              <thead className="bg-[#FFFCF7] text-[#77717F] uppercase text-[10px] font-bold border-b border-[#E9E1F5]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E1F5]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFFCF7]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-[#E9E1F5]" />
                        <div className="min-w-0 max-w-[240px]">
                          <p className="font-semibold text-[#292633] truncate">{p.name}</p>
                          <span className="text-[10px] text-[#77717F]">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#F4EFFF] text-[#7962B5] font-semibold text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      {formatINR(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${p.stock > 0 ? 'text-[#37866A]' : 'text-[#D94F70]'}`}>
                        {p.stock > 0 ? `${p.stock} units` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#77717F]">
                      ★ {p.rating} ({p.reviewCount})
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 text-[#77717F] hover:text-[#7962B5] hover:bg-[#F4EFFF] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-[#77717F] hover:text-[#D94F70] hover:bg-[#F6DDE8] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ORDERS PANEL */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Orders Recorded ({orders.length})</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E9E1F5] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#292633]">
              <thead className="bg-[#FFFCF7] text-[#77717F] uppercase text-[10px] font-bold border-b border-[#E9E1F5]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E1F5]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFFCF7]/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#292633]">{order.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#292633]">{order.deliveryAddress.name}</p>
                      <p className="text-[10px] text-[#77717F]">{order.deliveryAddress.city}, {order.deliveryAddress.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-[#77717F]">
                      {(() => {
                        const d = new Date(order.createdAt);
                        const day = d.getUTCDate();
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const month = months[d.getUTCMonth()];
                        const year = d.getUTCFullYear();
                        return `${day} ${month} ${year}`;
                      })()}
                    </td>
                    <td className="py-3 px-4 font-semibold">{order.items.length} item(s)</td>
                    <td className="py-3 px-4 font-bold text-[#7962B5]">{formatINR(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        order.paymentStatus === 'paid'
                          ? 'bg-[#37866A]/10 text-[#37866A]'
                          : 'bg-[#F6DDE8] text-[#7962B5]'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className="bg-[#FFFCF7] border border-[#E9E1F5] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#292633] focus:outline-none focus:border-[#7962B5]"
                      >
                        <option value="ordered">Ordered</option>
                        <option value="paid">Paid</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS PANEL */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Registered Users ({users.length})</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E9E1F5] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#292633]">
              <thead className="bg-[#FFFCF7] text-[#77717F] uppercase text-[10px] font-bold border-b border-[#E9E1F5]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Member Since</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E1F5]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FFFCF7]/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#292633]">{u.name}</td>
                    <td className="py-3 px-4 text-[#77717F]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#7962B5] text-white'
                          : 'bg-[#F4EFFF] text-[#7962B5]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#77717F]">
                      {(() => {
                        const d = new Date(u.createdAt);
                        const day = d.getUTCDate();
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const month = months[d.getUTCMonth()];
                        const year = d.getUTCFullYear();
                        return `${day} ${month} ${year}`;
                      })()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.id !== currentUserId ? (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-[#77717F] hover:text-[#D94F70] hover:bg-[#F6DDE8] rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#77717F] italic">(Current User)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
