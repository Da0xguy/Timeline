import { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShieldAlert, Sparkles, Plus, Minus, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface CartDrawerProps {
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (pId: string, size: 'S' | 'M' | 'L' | 'XL', delta: number) => void;
  onRemoveItem: (pId: string, size: 'S' | 'M' | 'L' | 'XL') => void;
  onCheckout: (appliedDiscountPercent: number, discountCode: string) => void;
}

export default function CartDrawer({
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingThreshold = 50000;
  const isFreeShipping = subtotal >= shippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const applyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'ONYX10' || code === 'AETHER10') {
      setDiscountPercent(10);
      setPromoSuccess('10% OFF DISCOUNT APPLIED.');
    } else if (code === 'VIP25') {
      setDiscountPercent(25);
      setPromoSuccess('25% MEMBER VIP DISCOUNT APPLIED.');
    } else {
      setPromoError('INVALID PROMO CODE.');
      setDiscountPercent(0);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
    >
      {/* Backdrop closer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Cart Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-900 h-full flex flex-col shadow-2xl justify-between"
        id="cart-drawer-panel"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between" id="cart-header">
          <div className="flex items-center space-x-2.5">
            <span className="font-serif text-xl tracking-wider text-white">YOUR BAG</span>
            <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-sm">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} ITEMS
            </span>
          </div>
          <button
            onClick={onClose}
            id="btn-close-cart"
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar" id="cart-body">
          {/* Shipping Tracker */}
          {cartItems.length > 0 && (
            <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-sm" id="shipping-tracker">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase mb-2">
                <span className="text-zinc-400">
                  {isFreeShipping ? 'ELIGIBLE FOR FREE SHIPPING' : `SPEND ₦${amountNeededForFreeShipping.toLocaleString()} MORE FOR FREE SHIPPING`}
                </span>
                <span className="text-zinc-300 font-bold">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item list */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center space-y-4" id="empty-cart-state">
              <div className="h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-sm tracking-wider text-zinc-400">YOUR CART IS COMPLETELY EMPTY</p>
                <p className="font-mono text-[10px] text-zinc-600 mt-1 uppercase">Select garments from the archive to begin.</p>
              </div>
              <button
                onClick={onClose}
                className="border border-zinc-800 px-6 py-2.5 text-[10px] font-mono tracking-widest text-zinc-300 hover:border-white hover:text-white transition-colors uppercase rounded-sm"
              >
                RETURN TO SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-4" id="cart-items-list">
              {cartItems.map((item, idx) => {
                const maxStock = item.product.stock_quantity;
                const isMaxReached = item.quantity >= maxStock;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    id={`cart-item-${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3 bg-zinc-900/10 border border-zinc-900/80 hover:border-zinc-850 rounded-sm transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="h-20 w-16 bg-zinc-900 overflow-hidden rounded-sm flex-shrink-0 border border-zinc-900">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details block */}
                    <div className="flex-grow flex flex-col justify-between" id="cart-item-details">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-xs tracking-wider text-zinc-200 uppercase leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="font-mono text-[9px] text-zinc-500 uppercase block mt-1">
                            SIZE: <span className="text-zinc-300 font-bold">{item.selectedSize}</span> // PRICE: ₦{item.product.price.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          id={`btn-remove-${item.product.id}-${item.selectedSize}`}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Quantity control with bounds checking */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900/40" id="cart-item-qty-row">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-sm">
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.selectedSize, -1)}
                              disabled={item.quantity <= 1}
                              className="px-2 py-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 font-mono text-xs"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="px-2 font-mono text-[10px] text-zinc-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.selectedSize, 1)}
                              disabled={isMaxReached}
                              className="px-2 py-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500 font-mono text-xs"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          
                          {isMaxReached && (
                            <span className="font-mono text-[8px] text-amber-500 uppercase flex items-center gap-0.5">
                              <ShieldAlert className="h-2.5 w-2.5" /> MAX STOCK
                            </span>
                          )}
                        </div>

                        <span className="font-mono text-xs font-medium text-zinc-100">
                          ₦{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Billing Details */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-900 bg-zinc-950 space-y-4" id="cart-footer-bill">
            
            {/* Promo Code Input */}
            <div className="space-y-1.5" id="promo-code-box">
              <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                APPLY PROMO / MEMBERSHIP CODE:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ENTER CODE (e.g. ONYX10, VIP25)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-sm py-2 pl-8 pr-2 font-mono text-[10px] text-white tracking-widest outline-none focus:border-zinc-500 placeholder:text-zinc-700 uppercase"
                  />
                  <Tag className="absolute left-2.5 top-2.5 h-3 w-3 text-zinc-600" />
                </div>
                <button
                  onClick={applyPromo}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-black hover:bg-white transition-all px-4 py-2 font-mono text-[10px] tracking-widest uppercase rounded-sm"
                >
                  APPLY
                </button>
              </div>

              {promoError && (
                <p className="font-mono text-[9px] text-red-500 uppercase">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="font-mono text-[9px] text-emerald-500 uppercase font-bold flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  {promoSuccess}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-2 border-t border-zinc-900/50" id="cart-breakdown-panel">
              <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                <span>SUBTOTAL</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between font-mono text-[11px] text-emerald-500">
                  <span>DISCOUNT ({discountPercent}%)</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                <span>SHIPPING FEE</span>
                <span>{isFreeShipping ? 'FREE' : '₦5,000'}</span>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-zinc-900">
                <span className="font-serif text-sm text-zinc-300">TOTAL</span>
                <span className="font-mono text-base font-bold text-white">
                  ₦{(finalTotal + (isFreeShipping ? 0 : 5000)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onCheckout(discountPercent, promoCode.trim().toUpperCase())}
              id="btn-checkout-drawer"
              className="w-full bg-white text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 rounded-sm"
            >
              <span>PROCEED TO CHECKOUT</span>
            </button>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
}
