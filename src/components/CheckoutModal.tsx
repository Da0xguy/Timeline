import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { X, CreditCard, Shield, Landmark, ArrowRight, Loader, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

export const formatWhatsAppMessage = (
  orderId: string,
  items: { productName: string; size: string; quantity: number; price: number }[],
  total: number,
  customerName: string,
  address: string
) => {
  let text = `*TIMELINE APPAREL ORDER - ${orderId}*\n`;
  text += `=========================\n\n`;
  text += `👤 *CUSTOMER DETAILS*\n`;
  text += `• *Name:* ${customerName}\n`;
  text += `• *Shipping Address:* ${address}\n\n`;
  text += `📦 *ORDERED ITEMS*\n`;
  items.forEach((item) => {
    text += `• *${item.productName}*\n`;
    text += `  Size: ${item.size} | Qty: ${item.quantity} | Price: ₦${item.price.toLocaleString()}\n`;
  });
  text += `\n💵 *SUMMARY*\n`;
  text += `• *Total Amount:* ₦${total.toLocaleString()}\n`;
  text += `=========================\n`;
  text += `Hello, I just placed an order. Please let me know how to pay. Thank you!`;
  return encodeURIComponent(text);
};

interface CheckoutModalProps {
  cartItems: CartItem[];
  subtotal: number;
  discountPercent: number;
  isFreeShipping: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  userEmail?: string;
}

export default function CheckoutModal({
  cartItems,
  subtotal,
  discountPercent,
  isFreeShipping,
  onClose,
  onSuccess,
  userEmail = 'ayobamioketona@gmail.com'
}: CheckoutModalProps) {
  // Form State
  const [email, setEmail] = useState(userEmail);
  const [fullName, setFullName] = useState('Ayobami Oketona');
  const [addressLine, setAddressLine] = useState('12 Finchley Road');
  const [city, setCity] = useState('Lagos');
  const [postalCode, setPostalCode] = useState('100001');
  const [country, setCountry] = useState('Nigeria');

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Totals
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingCost = isFreeShipping ? 0 : 5000;
  const grandTotal = subtotal - discountAmount + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!email || !fullName || !addressLine || !city || !postalCode || !country) {
      setValidationError('PLEASE FILL ALL SHIPPING FIELDS.');
      return;
    }

    // Process payment simulation
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        items: cartItems.map((item) => ({
          productName: item.product.name,
          price: item.product.price,
          size: item.selectedSize,
          quantity: item.quantity
        })),
        total: grandTotal,
        email: email,
        shippingAddress: {
          fullName,
          addressLine,
          city,
          postalCode,
          country
        }
      };

      setCompletedOrder(newOrder);

      // Auto-launch WhatsApp order transmission
      const message = formatWhatsAppMessage(
        newOrder.id,
        newOrder.items,
        newOrder.total,
        newOrder.shippingAddress.fullName,
        `${newOrder.shippingAddress.addressLine}, ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.postalCode}, ${newOrder.shippingAddress.country}`
      );
      window.open(`https://wa.me/2348105385548?text=${message}`, '_blank');
    }, 2200);
  };

  const handleCloseSuccess = () => {
    if (completedOrder) {
      onSuccess(completedOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
      
      {/* Processing Loader Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white space-y-4" id="checkout-loading-screen">
          <Loader className="h-10 w-10 text-white animate-spin" />
          <div className="text-center space-y-1">
            <p className="font-serif text-lg tracking-widest uppercase">PREPARING YOUR ORDER</p>
            <p className="font-mono text-[9px] text-emerald-500 uppercase tracking-[0.2em]">Setting up your WhatsApp message...</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-sm p-6 sm:p-8 my-8" id="checkout-main-container">
        
        {/* Success Screen state */}
        {completedOrder ? (
          <div className="flex flex-col items-center py-8 text-center space-y-6" id="success-screen">
            <div className="h-14 w-14 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wider text-white uppercase">
                ORDER SENT
              </h2>
              <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                ORDER COMPLETED SUCCESSFULLY // {completedOrder.id}
              </p>
            </div>

            {/* Receipt details */}
            <div className="w-full max-w-xl bg-zinc-900/30 border border-zinc-900 rounded-sm p-5 text-left font-mono text-[10px] text-zinc-400 space-y-4" id="success-receipt">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 uppercase">ORDER DATE</span>
                <span className="text-zinc-200">{completedOrder.date}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-500 uppercase">DELIVERY METHOD</span>
                <span className="text-zinc-200">STANDARD DELIVERY (3-5 DAYS)</span>
              </div>
              
              {/* Items summary */}
              <div className="space-y-1 border-b border-zinc-900 pb-3" id="receipt-items">
                <span className="text-zinc-500 uppercase block mb-1">ORDERED CLOTHES</span>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-300">
                    <span>{item.productName} (SIZE {item.size}) x{item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="border-b border-zinc-900 pb-3" id="receipt-address">
                <span className="text-zinc-500 uppercase block mb-1">DELIVERY DETAILS</span>
                <p className="text-zinc-300">{completedOrder.shippingAddress.fullName}</p>
                <p className="text-zinc-400">{completedOrder.shippingAddress.addressLine}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.postalCode}</p>
                <p className="text-zinc-400">{completedOrder.shippingAddress.country}</p>
              </div>

              <div className="flex justify-between items-end text-sm text-white font-bold pt-1" id="receipt-grandtotal">
                <span className="font-serif">TOTAL</span>
                <span className="text-base">₦{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <p className="max-w-md text-xs text-zinc-500 uppercase leading-relaxed">
              Your order is prepared. If WhatsApp did not open, please use the button below to send your details. Thank you for shopping with TIMELINE!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={() => {
                  const message = formatWhatsAppMessage(
                    completedOrder.id,
                    completedOrder.items,
                    completedOrder.total,
                    completedOrder.shippingAddress.fullName,
                    `${completedOrder.shippingAddress.addressLine}, ${completedOrder.shippingAddress.city}, ${completedOrder.shippingAddress.postalCode}, ${completedOrder.shippingAddress.country}`
                  );
                  window.open(`https://wa.me/2348105385548?text=${message}`, '_blank');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                </svg>
                <span>SEND TO WHATSAPP</span>
              </button>

              <button
                onClick={handleCloseSuccess}
                className="bg-white text-black px-10 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-sm"
              >
                RETURN TO SHOP
              </button>
            </div>
          </div>
        ) : (
          /* Form details */
          <div className="space-y-6" id="checkout-form-screen">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4" id="checkout-header">
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                <h2 className="font-serif text-lg tracking-wider text-white uppercase">WHATSAPP CHECKOUT</h2>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="checkout-form">
              
              {/* Left Column - Shipping details */}
              <div className="lg:col-span-7 space-y-6" id="checkout-shipping-group">
                <div className="border-b border-zinc-900 pb-2">
                  <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">01 // DELIVERY INFORMATION</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="shipping-inputs">
                  
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">CONTACT EMAIL:</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">FULL NAME:</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">STREET ADDRESS:</label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. Apartment, Suite, Street Address"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">TOWN / CITY:</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">POSTAL CODE:</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 100001"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">COUNTRY:</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Nigeria"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-2.5 px-3 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>
                </div>

                <div className="border-b border-zinc-900 pb-2 pt-4">
                  <span className="font-mono text-[9px] tracking-widest text-emerald-500 uppercase">02 // WHATSAPP CHECKOUT</span>
                </div>

                <div className="p-5 bg-emerald-950/10 border border-emerald-900/40 rounded-sm space-y-3" id="whatsapp-info-panel">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                    </svg>
                    <span className="font-mono text-[9px] font-bold text-emerald-400 tracking-widest uppercase">DIRECT WHATSAPP SHOPPING</span>
                  </div>
                  <p className="font-mono text-[8.5px] text-zinc-400 leading-relaxed uppercase">
                    Your order details will be packaged into a simple message. Clicking submit opens WhatsApp so you can send the details to the owner at <span className="text-emerald-400 font-bold">+234 810 538 5548</span> to discuss payment and delivery.
                  </p>
                  <div className="flex items-center gap-2.5 border-t border-zinc-900 pt-2 font-mono text-[7.5px] text-zinc-500 uppercase">
                    <span>• NO CREDIT CARD REQUIRED</span>
                    <span>• NO EXTRA FEES</span>
                    <span>• DIRECT TO OWNER</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary Billing */}
              <div className="lg:col-span-5 flex flex-col justify-between" id="checkout-summary-group">
                <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-sm space-y-6" id="checkout-summary-box">
                  <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase border-b border-zinc-900 pb-2">
                    03 // ORDER SUMMARY
                  </span>

                  <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar" id="summary-items">
                    {cartItems.map((item) => (
                      <div key={`${item.product.id}-${item.selectedSize}`} className="flex justify-between gap-4 text-xs font-mono">
                        <div className="space-y-0.5">
                          <p className="text-zinc-200 uppercase tracking-wide truncate max-w-[160px]">{item.product.name}</p>
                          <span className="text-[9px] text-zinc-500 uppercase block">SIZE: {item.selectedSize} // QUANTITY: {item.quantity}</span>
                        </div>
                        <span className="text-zinc-400 font-bold">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-zinc-900 pt-4" id="summary-breakdowns">
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                      <span>SUBTOTAL</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between font-mono text-[10px] text-emerald-500">
                        <span>DISCOUNT ({discountPercent}%)</span>
                        <span>-₦{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                      <span>SHIPPING FEE</span>
                      <span>{isFreeShipping ? 'FREE' : '₦5,000'}</span>
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-zinc-900 text-white font-bold" id="summary-total">
                      <span className="font-serif text-sm">TOTAL AMOUNT</span>
                      <span className="font-mono text-base">₦{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {validationError && (
                    <p className="font-mono text-[10px] text-red-500 text-center font-bold uppercase">{validationError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-500 py-4 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center space-x-2 rounded-sm"
                  >
                    <span>SEND ORDER TO WHATSAPP</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center" id="checkout-security-badges">
                  <div className="flex items-center space-x-1 font-mono text-[8px] tracking-widest text-zinc-600 uppercase">
                    <Shield className="h-3.5 w-3.5" />
                    <span>DIRECT ORDERING</span>
                    <span>•</span>
                    <Landmark className="h-3.5 w-3.5" />
                    <span>TIMELINE APPAREL</span>
                  </div>
                  <p className="font-mono text-[7px] text-zinc-700 uppercase tracking-widest">
                    Your order details will open in WhatsApp so you can chat directly with us. Easy, fast and completely secure!
                  </p>
                </div>

              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
