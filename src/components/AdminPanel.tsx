import React, { useState } from 'react';
import { Product, Order } from '../types';
import { Plus, Check, Settings, Image as ImageIcon, AlertCircle, TrendingUp, BarChart3, Package, Layers } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Omit<Product, 'id'>) => void;
  onRestock: (pId: string, qty: number) => void;
  onRemoveProduct: (pId: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onRestock,
  onRemoveProduct
}: AdminPanelProps) {
  // Add product form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('25000');
  const [category, setCategory] = useState<'Hoodies' | 'Tees' | 'Outerwear' | 'Accessories'>('Hoodies');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [selectedSizes, setSelectedSizes] = useState<('S' | 'M' | 'L' | 'XL')[]>(['S', 'M', 'L', 'XL']);
  const [customDetails, setCustomDetails] = useState('100% Premium cotton, Dry clean recommended');

  const [formSuccess, setFormSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Analytics derivations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0),
    0
  );

  const getStockStatus = (p: Product) => {
    if (p.stock_quantity === 0) return { label: 'OUT OF STOCK', color: 'text-red-500 bg-red-950/20' };
    if (p.stock_quantity <= 5) return { label: 'LOW STOCK', color: 'text-amber-500 bg-amber-950/20' };
    return { label: 'STABLE', color: 'text-emerald-500 bg-emerald-950/20' };
  };

  const handleSizeToggle = (sz: 'S' | 'M' | 'L' | 'XL') => {
    if (selectedSizes.includes(sz)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== sz));
    } else {
      setSelectedSizes([...selectedSizes, sz]);
    }
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFormSuccess(false);

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Price must be a valid positive number.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Stock quantity must be zero or more.');
      return;
    }
    if (selectedSizes.length === 0) {
      setErrorMsg('Please select at least one available size.');
      return;
    }

    // Default premium image if they left it empty
    const imgUrlToUse = imageUrl.trim() || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80';

    // Parse custom details
    const detailsArr = customDetails
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    // Call upstream trigger
    onAddProduct({
      name: name.toUpperCase().trim(),
      price: priceNum,
      category,
      image_url: imgUrlToUse,
      description: description.trim() || 'Premium release apparel crafted with custom high-density knitting.',
      stock_quantity: stockNum,
      sizes: selectedSizes,
      details: detailsArr.length > 0 ? detailsArr : ['100% Premium Material', 'Handcrafted details']
    });

    // Reset Form
    setName('');
    setPrice('25000');
    setImageUrl('');
    setDescription('');
    setStock('10');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fade-in" id="admin-panel-container">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-6 gap-4" id="admin-title-panel">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            TIMELINE APPAREL // STORE MANAGER
          </span>
          <h2 className="font-serif text-3xl font-light tracking-wider text-white uppercase mt-1">
            STORE DASHBOARD
          </h2>
        </div>
        <p className="font-mono text-[10px] text-zinc-500 uppercase max-w-sm text-right hidden md:block">
          Add new clothes, update stock, and see your sales summary.
        </p>
      </div>

      {/* Analytics Dashboard section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-analytics-grid">
        
        {/* Metric 1 */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm flex items-start space-x-4">
          <div className="p-2.5 bg-zinc-900 rounded-sm text-zinc-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase">TOTAL REVENUE</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">₦{totalRevenue.toLocaleString()}</span>
            <span className="text-[9px] font-mono text-emerald-500 mt-1 block">✓ COMPLETED SALES</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm flex items-start space-x-4">
          <div className="p-2.5 bg-zinc-900 rounded-sm text-zinc-400">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase">UNITS SOLD</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">{totalUnitsSold} PIECES</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 block">DELIVERED TO CUSTOMERS</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm flex items-start space-x-4">
          <div className="p-2.5 bg-zinc-900 rounded-sm text-zinc-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase">COMPLETED ORDERS</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">{orders.length} ORDERS</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 block">WHATSAPP PORTAL ACTIVE</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm flex items-start space-x-4">
          <div className="p-2.5 bg-zinc-900 rounded-sm text-zinc-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase">ITEMS OFFERED</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">{products.length} CLOTHES</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 block">IN MULTIPLE CATEGORIES</span>
          </div>
        </div>

      </div>

      {/* Double Column Area: Left is stock management, Right is add new product form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin-main-grid">
        
        {/* Left column - Live Inventory Table */}
        <div className="lg:col-span-7 space-y-6" id="admin-inventory-panel">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              YOUR CLOTHES
            </span>
            <span className="font-mono text-[9px] text-zinc-600">
              Click +5 or +20 to add more stock
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden" id="inventory-table-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-[10px]">
                <thead>
                  <tr className="bg-zinc-900/60 text-zinc-500 uppercase border-b border-zinc-900">
                    <th className="p-3">ITEM</th>
                    <th className="p-3 text-center">CATEGORY</th>
                    <th className="p-3 text-center">PRICE</th>
                    <th className="p-3 text-center">STOCK</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const status = getStockStatus(p);

                    return (
                      <tr key={p.id} id={`admin-row-${p.id}`} className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-all">
                        {/* Garment Title and info */}
                        <td className="p-3 flex items-center space-x-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-10 w-8 object-cover bg-zinc-900 border border-zinc-850 rounded-sm"
                          />
                          <div className="truncate max-w-[140px]">
                            <span className="block text-zinc-200 font-semibold truncate uppercase">{p.name}</span>
                            <span className="text-[9px] text-zinc-600 uppercase block truncate">S, M, L, XL</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3 text-center uppercase text-zinc-400">
                          {p.category}
                        </td>

                        {/* Price */}
                        <td className="p-3 text-center text-zinc-200 font-semibold">
                          ₦{p.price.toLocaleString()}
                        </td>

                        {/* Stock */}
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-zinc-200 font-bold">{p.stock_quantity} units</span>
                            <span className={`px-1.5 py-0.5 text-[8px] rounded-sm font-semibold tracking-wider ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                        </td>

                        {/* Replenish / Delete Actions */}
                        <td className="p-3 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => onRestock(p.id, 5)}
                              id={`restock-5-${p.id}`}
                              className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-[#991b1b]/80 hover:border-[#991b1b] px-2 py-1 text-[9px] font-bold rounded-sm transition-colors uppercase"
                              title="Replenish 5 units"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => onRestock(p.id, 20)}
                              id={`restock-20-${p.id}`}
                              className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-[#991b1b]/80 hover:border-[#991b1b] px-2 py-1 text-[9px] font-bold rounded-sm transition-colors uppercase"
                              title="Replenish 20 units"
                            >
                              +20
                            </button>
                            <button
                              onClick={() => onRemoveProduct(p.id)}
                              id={`remove-product-${p.id}`}
                              className="text-red-500/70 hover:text-red-400 px-1 py-1 text-[9px]"
                              title="Delist product"
                            >
                              REMOVE
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column - Create New Product Form */}
        <div className="lg:col-span-5 space-y-6" id="admin-add-product-panel">
          <div className="border-b border-zinc-900 pb-3">
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              ADD NEW ITEM
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-sm p-5 space-y-4" id="add-product-form-box">
            
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                  ITEM NAME:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONOLITH PULLOVER HOODIE"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none uppercase"
                />
              </div>

              {/* Price & Category in single row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                    PRICE (₦):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="25000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                    CATEGORY:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                  >
                    <option value="Hoodies">HOODIES</option>
                    <option value="Tees">TEES</option>
                    <option value="Outerwear">OUTERWEAR</option>
                    <option value="Accessories">ACCESSORIES</option>
                  </select>
                </div>
              </div>

              {/* Image URL with icon */}
              <div className="space-y-1">
                <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  IMAGE ARCHIVE URL (OPTIONAL):
                </label>
                <input
                  type="url"
                  placeholder="Paste Unsplash image address, or leave blank for default"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[9px] tracking-widest outline-none"
                />
                <span className="block text-[8px] text-zinc-600 font-mono">
                  PRO-TIP: Right-click any dress photo on Google/Unsplash and copy image address.
                </span>
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1">
                <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                  INITIAL STOCK COUNT:
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                  EDITORIAL FIT DESCRIPTION:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cut from dense double-knit weave. Pre-shrunk drop shoulder panels styled for structured protection."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none resize-none"
                />
              </div>

              {/* Custom Details specs */}
              <div className="space-y-1">
                <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                  BULLET SPECIFICATIONS (COMMA SEPARATED):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% Organic Heavy Knit Cotton, Pre-shrunk, Made in Portugal"
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2 px-3 rounded-sm font-mono text-[9px] tracking-widest outline-none"
                />
              </div>

              {/* Sizing Toggles */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                  SIZES AVAILABLE:
                </label>
                <div className="flex gap-2">
                  {(['S', 'M', 'L', 'XL'] as const).map((sz) => {
                    const isChecked = selectedSizes.includes(sz);

                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => handleSizeToggle(sz)}
                        className={`h-8 w-10 text-[10px] font-mono font-bold uppercase transition-all rounded-sm border ${
                          isChecked
                            ? 'bg-[#991b1b] text-white border-[#991b1b] shadow-[0_0_8px_rgba(153,27,27,0.4)]'
                            : 'bg-zinc-900/50 text-zinc-500 border-zinc-900 hover:border-[#991b1b]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorMsg && (
                <p className="font-mono text-[9px] text-red-500 font-bold uppercase flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errorMsg}
                </p>
              )}

              {formSuccess && (
                <p className="font-mono text-[9px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  ITEM ADDED SUCCESSFULLY.
                </p>
              )}

              <button
                type="submit"
                id="btn-add-garment"
                className="w-full bg-[#991b1b] text-white hover:bg-[#7f1d1d] py-3 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-1.5 rounded-sm shadow-[0_4px_12px_rgba(153,27,27,0.25)]"
              >
                <Plus className="h-4 w-4" />
                <span>ADD ITEM</span>
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
