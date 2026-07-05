import { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandMission from './components/BrandMission';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import FeaturedCarousel from './components/FeaturedCarousel';
import { SlidersHorizontal, ShieldAlert, Sparkles, AlertCircle, ShoppingBag, X, Shield, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent Storage State ---
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('aether_products_v1');
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('aether_cart_v1');
    return local ? JSON.parse(local) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('aether_orders_v1');
    return local ? JSON.parse(local) : [];
  });

  // --- Interaction & Filtering State ---
  const [currentView, setCurrentView] = useState<'home' | 'gallery'>('home');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hoodies' | 'Tees' | 'Outerwear' | 'Accessories'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // --- Modal Toggle State ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  // --- Toast/Micro notification state ---
  const [toastMessage, setToastMessage] = useState('');

  // Save to LocalStorage on modification
  useEffect(() => {
    localStorage.setItem('aether_products_v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aether_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aether_orders_v1', JSON.stringify(orders));
  }, [orders]);

  // Micro notification toaster
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // --- Cart Calculations Helper ---
  const getCartQuantityForProductSize = (prod: Product, size: 'S' | 'M' | 'L' | 'XL') => {
    const found = cart.find(
      (item) => item.product.id === prod.id && item.selectedSize === size
    );
    return found ? found.quantity : 0;
  };

  // --- Core Handler Functions ---

  // Add Item to Bag (Incremental & Stock-Guarded)
  const handleAddToCart = (product: Product, size: 'S' | 'M' | 'L' | 'XL', quantityToAdd: number) => {
    // Re-verify current stock limits
    const currentProductInDB = products.find((p) => p.id === product.id);
    if (!currentProductInDB) return;

    const availableStock = currentProductInDB.stock_quantity;
    const currentInCart = getCartQuantityForProductSize(product, size);
    const maxAddable = Math.max(0, availableStock - currentInCart);

    if (maxAddable === 0) {
      showToast(`CANNOT ADD MORE. SIZE ${size} IS AT MAXIMUM STOCK.`);
      return;
    }

    const finalQtyToAdd = Math.min(quantityToAdd, maxAddable);

    setCart((prevCart) => {
      const matchIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (matchIndex > -1) {
        // Increment quantity of existing match
        const newCart = [...prevCart];
        newCart[matchIndex] = {
          ...newCart[matchIndex],
          quantity: newCart[matchIndex].quantity + finalQtyToAdd
        };
        return newCart;
      } else {
        // Append new combination
        return [...prevCart, { product, selectedSize: size, quantity: finalQtyToAdd }];
      }
    });

    showToast(`ADDED ${finalQtyToAdd}x ${product.name} (SIZE ${size}) TO BAG`);
  };

  // Update Item Quantity directly inside Cart Drawer
  const handleUpdateCartQty = (productId: string, size: 'S' | 'M' | 'L' | 'XL', delta: number) => {
    const dbProduct = products.find((p) => p.id === productId);
    if (!dbProduct) return;

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          const targetQty = item.quantity + delta;
          // Guard stock limit
          const validatedQty = Math.min(Math.max(1, targetQty), dbProduct.stock_quantity);
          return { ...item, quantity: validatedQty };
        }
        return item;
      });
    });
  };

  // Remove completely from cart
  const handleRemoveCartItem = (productId: string, size: 'S' | 'M' | 'L' | 'XL') => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
    showToast('REMOVED ITEM FROM BAG');
  };

  // Trigger Checkout view with current calculations
  const handleProceedToCheckout = (discountPercent: number) => {
    setCheckoutDiscount(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Complete Simulated Checkout - updates permanent stock and registers order
  const handleCheckoutSuccess = (completedOrder: Order) => {
    // 1. Decrement product inventory in products database
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        // Find if this product was purchased
        const purchasedItems = cart.filter((item) => item.product.id === p.id);
        if (purchasedItems.length > 0) {
          const totalQtyPurchased = purchasedItems.reduce((sum, item) => sum + item.quantity, 0);
          const newStock = Math.max(0, p.stock_quantity - totalQtyPurchased);
          return { ...p, stock_quantity: newStock };
        }
        return p;
      });
    });

    // 2. Add to order history
    setOrders((prevOrders) => [completedOrder, ...prevOrders]);

    // 3. Clear shopping bag and close checkout modals
    setCart([]);
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    showToast(`ORDER ${completedOrder.id} DISPATCHED SUCCESSFULLY!`);
  };

  // Instant WhatsApp Direct Single-item order handler
  const handleDirectWhatsAppCheckout = (
    product: Product,
    size: 'S' | 'M' | 'L' | 'XL',
    quantity: number,
    fullName: string,
    address: string,
    email: string,
    phone: string
  ) => {
    // 1. Decrement single product stock quantity
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          return { ...p, stock_quantity: Math.max(0, p.stock_quantity - quantity) };
        }
        return p;
      })
    );

    // 2. Register new order
    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [{
        productName: product.name,
        price: product.price,
        size,
        quantity
      }],
      total: product.price * quantity,
      email: email,
      phone: phone,
      shippingAddress: {
        fullName,
        addressLine: address,
        city: '',
        postalCode: '',
        country: ''
      }
    };
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Fire custom WhatsApp message formatting
    let text = `*TIMELINE APPAREL ORDER - ${newOrderId}*\n`;
    text += `=========================\n\n`;
    text += `👤 *CUSTOMER DETAILS*\n`;
    text += `• *Name:* ${fullName}\n`;
    text += `• *Phone:* ${phone}\n`;
    text += `• *Email:* ${email}\n`;
    text += `• *Shipping Address:* ${address}\n\n`;
    text += `📦 *ORDERED ITEM*\n`;
    text += `• *${product.name}*\n`;
    text += `  Size: ${size} | Qty: ${quantity} | Price: ₦${product.price.toLocaleString()}\n`;
    text += `\n💵 *SUMMARY*\n`;
    text += `• *Total Amount:* ₦${(product.price * quantity).toLocaleString()}\n`;
    text += `=========================\n`;
    text += `Hello, I just placed an order. Please let me know how to pay. Thank you!`;

    window.open(`https://wa.me/2348105385548?text=${encodeURIComponent(text)}`, '_blank');
    showToast(`WhatsApp order sent!`);
  };

  // --- Admin Console Operations ---

  // Add Product Form Handler
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProductData,
      id: newId
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Item "${newProduct.name}" added to store.`);
  };

  // Restock existing product
  const handleRestockProduct = (productId: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, stock_quantity: p.stock_quantity + qty };
        }
        return p;
      })
    );
    showToast('Stock updated successfully.');
  };

  // Delist/remove product
  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // clean cart too
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from store.');
  };

  // --- Filter and Search Derivations ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Keyword Search Filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // Sort Ordering
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Cart helper calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const isCartEligibleForFreeShipping = cartSubtotal >= 50000;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-white selection:text-black" id="app-viewport">
      
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div
          id="global-hud-toast"
          className="fixed bottom-6 right-6 z-50 bg-white text-black font-mono text-[9px] tracking-widest uppercase py-3.5 px-6 rounded-sm shadow-2xl border border-zinc-200 animate-slide-up flex items-center space-x-2.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-zinc-800" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Layer */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        isAdmin={isAdmin}
        onAdminToggle={() => {
          if (isAdmin) {
            setIsAdmin(false);
            showToast('Logged out of Admin Panel.');
          } else {
            setShowAdminLogin(true);
            setAdminPasswordInput('');
            setAdminLoginError('');
          }
        }}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          // Scroll to top when changing views
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Core Viewport */}
      <main className="flex-grow">
        
        {isAdmin ? (
          /* Store management backend dashboard panel */
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onRestock={handleRestockProduct}
            onRemoveProduct={handleRemoveProduct}
          />
        ) : (
          /* Luxury Front-Facing Client Experience */
          <div id="client-shop-experience" className="space-y-4">
            <AnimatePresence mode="wait">
              {currentView === 'home' ? (
                <motion.div
                  key="home-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* Immersive Hero Landing Section */}
                  <Hero onExploreClick={() => {
                    setCurrentView('gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} />

                  {/* Sacred Brand Mission Statement */}
                  <BrandMission />

                  {/* Featured Products Carousel */}
                  <FeaturedCarousel
                    products={products}
                    onSelect={(p) => setSelectedProduct(p)}
                    onQuickAdd={(p, sz) => handleAddToCart(p, sz, 1)}
                    onViewAllClick={() => {
                      setCurrentView('gallery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="gallery-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10"
                  id="product-grid-section"
                >
                  {/* Gallery Title & Mobile Friendly Subcategories Row */}
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-5 gap-4" id="gallery-header-row">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-500 uppercase font-semibold">
                          TIMELINE APPAREL CATALOG // GALLERY
                        </span>
                        <h2 className="font-serif text-3xl font-light tracking-wider text-white uppercase">
                          {selectedCategory === 'All' ? 'ALL PRODUCTS' : selectedCategory.toUpperCase()}
                        </h2>
                      </div>

                      {/* Go Back Home button */}
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-mono tracking-widest text-zinc-500 hover:text-white uppercase transition-colors self-start md:self-auto border border-zinc-900 hover:border-zinc-700 px-4 py-2 rounded-sm"
                      >
                        ← BACK TO HOME
                      </button>
                    </div>

                    {/* Horizontal Categories Filter - Moved to Gallery as requested, highly mobile scrollable */}
                    <div className="flex flex-col gap-4 bg-zinc-950/40 border border-zinc-900 p-4 rounded-sm" id="gallery-filter-card">
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Left: Category buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar max-w-full" id="gallery-categories-scroller">
                          {(['All', 'Hoodies', 'Tees', 'Outerwear', 'Accessories'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`whitespace-nowrap px-4 py-2 text-[10.5px] font-mono font-medium tracking-widest uppercase rounded-sm border transition-all ${
                                selectedCategory === cat
                                  ? 'bg-white text-black border-white font-bold'
                                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-900 hover:text-white hover:border-zinc-700'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Right: Search Input + Sorting */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto" id="gallery-controls-inputs">
                          {/* Search Input block */}
                          <div className="relative flex-grow sm:flex-grow-0" id="gallery-search-block">
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="SEARCH CLOTHES..."
                              className="w-full sm:w-48 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 pl-8 pr-3 rounded-sm font-mono text-[10px] tracking-widest outline-none placeholder:text-zinc-600 uppercase"
                            />
                            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-500" />
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>

                          {/* Sort Selector */}
                          <div className="flex items-center space-x-2 border border-zinc-900 bg-zinc-900/20 px-3 py-2.5 rounded-sm" id="gallery-sort-box">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
                            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SORT:</span>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className="bg-transparent text-[9px] font-mono text-zinc-200 outline-none cursor-pointer tracking-widest uppercase border-none focus:ring-0 p-0"
                            >
                              <option value="default" className="bg-zinc-950">DEFAULT</option>
                              <option value="price-asc" className="bg-zinc-950">PRICE: LOW-HIGH</option>
                              <option value="price-desc" className="bg-zinc-950">PRICE: HIGH-LOW</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Product Grid */}
                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border border-zinc-900/60 rounded-sm" id="empty-results-state">
                      <AlertCircle className="h-8 w-8 text-zinc-600" />
                      <div>
                        <p className="font-serif text-lg text-zinc-300 tracking-wider">NO CLOTHES FOUND</p>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mt-1">
                          No items match your filters or search terms. Try resetting.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                        }}
                        className="border border-zinc-800 hover:border-white text-zinc-300 hover:text-white font-mono text-[9px] tracking-widest px-6 py-2.5 uppercase transition-colors rounded-sm"
                      >
                        RESET ALL FILTERS
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="apparel-cards-grid">
                      {filteredProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onSelect={(p) => setSelectedProduct(p)}
                          onQuickAdd={(p, sz) => handleAddToCart(p, sz, 1)}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Elegant Editorial Footer block */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 mt-16 text-zinc-500 font-mono text-[9px] tracking-widest uppercase" id="store-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8" id="footer-links-grid">
            
            {/* Column 1 */}
            <div className="space-y-3">
              <span className="text-zinc-400 font-serif text-sm tracking-widest font-bold">TIMELINE STUDIO</span>
              <p className="text-zinc-600 normal-case leading-relaxed font-light">
                Christian-inspired fashion focusing on faith, creativity, and a connection to Jesus.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <span className="text-zinc-400 font-bold">COLLECTIONS</span>
              <ul className="space-y-1.5 text-zinc-600">
                <li><button onClick={() => setSelectedCategory('Hoodies')} className="hover:text-white transition-colors text-left">HOODIES</button></li>
                <li><button onClick={() => setSelectedCategory('Tees')} className="hover:text-white transition-colors text-left">TEES</button></li>
                <li><button onClick={() => setSelectedCategory('Outerwear')} className="hover:text-white transition-colors text-left">OUTERWEAR</button></li>
                <li><button onClick={() => setSelectedCategory('Accessories')} className="hover:text-white transition-colors text-left">ACCESSORIES</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              <span className="text-zinc-400 font-bold">CUSTOMER DESK</span>
              <ul className="space-y-1.5 text-zinc-600">
                <li><a href="#shipping" className="hover:text-white transition-colors">STANDARD COURIER DELIVERY</a></li>
                <li><a href="#returns" className="hover:text-white transition-colors">EASY RETURNS</a></li>
                <li><a href="#sizing" className="hover:text-white transition-colors">SIZING CHART</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">SUPPORT</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-2">
              <span className="text-zinc-400 font-bold">WHATSAPP SHOPPING</span>
              <p className="text-zinc-600 normal-case leading-relaxed font-light">
                Shop directly with us. Your order details will be sent to our WhatsApp desk so we can prepare your items and chat with you directly.
              </p>
            </div>

          </div>

          <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-zinc-600 text-[8px] gap-4" id="footer-bottom-ribbon">
            <span>© 2026 TIMELINE STUDIO APPAREL. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-4">
              <a href="#terms" className="hover:text-zinc-400">TERMS OF SALE</a>
              <span>•</span>
              <a href="#privacy" className="hover:text-zinc-400">PRIVACY PROTOCOL</a>
              <span>•</span>
              <span className="text-zinc-500">WEAR YOUR VALUES</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Overlay Modal Containers --- */}

      {/* Product Detailed Spec Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            currentCartQtyForProduct={getCartQuantityForProductSize}
            onDirectWhatsAppCheckout={handleDirectWhatsAppCheckout}
          />
        )}
      </AnimatePresence>

      {/* Sliding Cart bag drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleProceedToCheckout}
          />
        )}
      </AnimatePresence>

      {/* Simulated Secure Credit Payment Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            cartItems={cart}
            subtotal={cartSubtotal}
            discountPercent={checkoutDiscount}
            isFreeShipping={isCartEligibleForFreeShipping}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </AnimatePresence>

      {/* Admin Decryption Login Challenge Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" 
            id="admin-login-modal"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-sm p-6 sm:p-8 space-y-6" 
              id="admin-login-box"
            >
              
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="flex items-center space-x-2.5">
                  <Shield className="h-5 w-5 text-zinc-400" />
                  <h3 className="font-serif text-lg tracking-wider text-white uppercase">ADMIN LOGIN</h3>
                </div>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="text-zinc-500 hover:text-white transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                  Enter the password to access the store management dashboard.
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (adminPasswordInput === 'timeline@2025') {
                    setIsAdmin(true);
                    setShowAdminLogin(false);
                    setAdminPasswordInput('');
                    showToast('Logged in as Admin successfully.');
                  } else {
                    setAdminLoginError('Incorrect password. Please try again.');
                  }
                }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                      PASSWORD:
                    </label>
                    <input
                      type="password"
                      required
                      autoFocus
                      placeholder="••••••••••••"
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        setAdminLoginError('');
                      }}
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-3 px-4 rounded-sm font-mono text-[11px] tracking-[0.25em] outline-none text-center"
                    />
                  </div>

                  {adminLoginError && (
                    <p className="font-mono text-[9px] text-red-500 font-bold uppercase text-center flex items-center justify-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {adminLoginError}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminLogin(false)}
                      className="flex-1 border border-zinc-900 hover:border-zinc-500 text-zinc-400 hover:text-white font-mono text-[10px] tracking-widest uppercase py-3 rounded-sm transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold font-mono text-[10px] tracking-widest uppercase py-3 rounded-sm transition-colors"
                    >
                      LOGIN
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
