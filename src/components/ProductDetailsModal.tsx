import { useState } from 'react';
import { Product } from '../types';
import { X, Check, ShieldAlert, ArrowRight, Ruler } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, size: 'S' | 'M' | 'L' | 'XL', qty: number) => void;
  currentCartQtyForProduct: (p: Product, size: 'S' | 'M' | 'L' | 'XL') => number;
  onDirectWhatsAppCheckout: (p: Product, size: 'S' | 'M' | 'L' | 'XL', qty: number, fullName: string, address: string) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  currentCartQtyForProduct,
  onDirectWhatsAppCheckout
}: ProductDetailsModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const [isWhatsAppFlow, setIsWhatsAppFlow] = useState(false);
  const [waName, setWaName] = useState('Ayobami Oketona');
  const [waAddress, setWaAddress] = useState('12 Finchley Road, London, NW3 6EB, United Kingdom');
  const [waError, setWaError] = useState('');

  const isOutOfStock = product.stock_quantity === 0;
  const alreadyInCart = currentCartQtyForProduct(product, selectedSize);
  const remainingStock = Math.max(0, product.stock_quantity - alreadyInCart);
  const isSelectedSizeOutOfStock = remainingStock === 0;

  const handleAdd = () => {
    if (isSelectedSizeOutOfStock || quantity > remainingStock) return;
    
    onAddToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      
      {/* Container Card */}
      <div
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden p-6 md:p-8 my-8"
        id="details-modal-box"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-details"
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-2"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12" id="details-modal-grid">
          
          {/* Image Showcase Left Column */}
          <div className="md:col-span-6 flex flex-col space-y-4" id="details-image-panel">
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-sm border border-zinc-900">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            {/* Fine print */}
            <div className="flex justify-between items-center px-1 font-mono text-[9px] text-zinc-500" id="details-fine-print">
              <span>WASHED GRAPHITE ARCHIVE</span>
              <span>EST. 2026 // MODEL 188CM // WEARING L</span>
            </div>
          </div>

          {/* Product Data Right Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6" id="details-data-panel">
            
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  {product.category} ARCHIVE
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wider text-white uppercase mt-1">
                  {product.name}
                </h2>
                <div className="flex items-center space-x-3 mt-2 font-mono text-sm text-zinc-300">
                  <span>₦{product.price.toLocaleString()}</span>
                  <span className="text-zinc-700">|</span>
                  <span className={product.stock_quantity > 0 ? 'text-emerald-500 font-medium' : 'text-red-500 font-bold'}>
                    {product.stock_quantity > 0 ? `IN STOCK (${product.stock_quantity} available)` : 'SOLD OUT'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Fabrication specifications */}
              <div className="border-t border-b border-zinc-900 py-4 space-y-2" id="details-spec-list">
                <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                  SPECIFICATIONS & FIT:
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-400">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="font-light">{detail}</li>
                  ))}
                </ul>
              </div>

              {/* Size Selectors */}
              <div className="space-y-2" id="details-size-selection">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                    SELECT SIZE:
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="flex items-center space-x-1 font-mono text-[9px] tracking-widest text-zinc-400 hover:text-white transition-colors"
                  >
                    <Ruler className="h-3 w-3" />
                    <span>SIZE CHART</span>
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-sm font-mono text-[9px] text-zinc-400 leading-relaxed animate-fade-in" id="size-guide-info">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500">
                          <th className="py-1">SIZE</th>
                          <th className="py-1">CHEST (IN)</th>
                          <th className="py-1">LENGTH (IN)</th>
                          <th className="py-1">SLEEVE (IN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-900">
                          <td className="py-1 font-semibold text-zinc-300">S</td>
                          <td className="py-1">36 - 38</td>
                          <td className="py-1">26.5</td>
                          <td className="py-1">32.5</td>
                        </tr>
                        <tr className="border-b border-zinc-900">
                          <td className="py-1 font-semibold text-zinc-300">M</td>
                          <td className="py-1">39 - 41</td>
                          <td className="py-1">27.5</td>
                          <td className="py-1">33.5</td>
                        </tr>
                        <tr className="border-b border-zinc-900">
                          <td className="py-1 font-semibold text-zinc-300">L</td>
                          <td className="py-1">42 - 44</td>
                          <td className="py-1">28.5</td>
                          <td className="py-1">34.5</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold text-zinc-300">XL</td>
                          <td className="py-1">45 - 47</td>
                          <td className="py-1">29.5</td>
                          <td className="py-1">35.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex gap-2" id="modal-size-chips">
                  {product.sizes.map((sz) => {
                    const isSizeAvailable = product.stock_quantity > currentCartQtyForProduct(product, sz);
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          setSelectedSize(sz);
                          setQuantity(1);
                        }}
                        disabled={!isSizeAvailable}
                        id={`modal-size-${sz}`}
                        className={`h-10 w-12 text-xs font-mono font-medium tracking-widest uppercase transition-all rounded-sm border ${
                          !isSizeAvailable
                            ? 'border-zinc-950 bg-zinc-900/10 text-zinc-700 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-500'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selectors */}
              {!isOutOfStock && !isSelectedSizeOutOfStock && (
                <div className="space-y-2" id="details-quantity-selection">
                  <span className="block font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                    QUANTITY:
                  </span>
                  <div className="flex items-center space-x-3" id="qty-picker">
                    <div className="flex items-center border border-zinc-800 bg-zinc-900/20 rounded-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 text-zinc-400 hover:text-white font-mono text-sm"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-mono text-xs text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(remainingStock, quantity + 1))}
                        className="px-3 py-1.5 text-zinc-400 hover:text-white font-mono text-sm"
                      >
                        +
                      </button>
                    </div>
                    {alreadyInCart > 0 && (
                      <span className="font-mono text-[9px] text-zinc-500">
                        ({alreadyInCart} already in cart)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="space-y-3 pt-6 border-t border-zinc-900" id="details-action-block">
              {isWhatsAppFlow ? (
                <div className="space-y-4 bg-zinc-950 border border-zinc-900 p-4 rounded-sm animate-fade-in animate-duration-300" id="wa-checkout-subform">
                  <span className="block font-mono text-[9px] tracking-widest text-emerald-400 uppercase">
                    DELIVERY DETAILS
                  </span>
                  
                  <div className="space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">YOUR FULL NAME:</label>
                    <input
                      type="text"
                      required
                      value={waName}
                      onChange={(e) => {
                        setWaName(e.target.value);
                        setWaError('');
                      }}
                      placeholder="Ayobami Oketona"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-1.5 px-2.5 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">DELIVERY ADDRESS:</label>
                    <input
                      type="text"
                      required
                      value={waAddress}
                      onChange={(e) => {
                        setWaAddress(e.target.value);
                        setWaError('');
                      }}
                      placeholder="12 Finchley Road, London"
                      className="w-full bg-zinc-900/50 border border-zinc-900 focus:border-zinc-500 text-zinc-200 py-1.5 px-2.5 rounded-sm font-mono text-[10px] tracking-widest outline-none"
                    />
                  </div>

                  {waError && (
                    <p className="font-mono text-[9px] text-red-500 uppercase font-medium">{waError}</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setIsWhatsAppFlow(false);
                        setWaError('');
                      }}
                      className="flex-1 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 font-mono text-[9px] tracking-widest uppercase py-2.5 rounded-sm transition-colors"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => {
                        if (!waName.trim() || !waAddress.trim()) {
                          setWaError('PLEASE FILL IN BOTH YOUR NAME AND DELIVERY ADDRESS.');
                          return;
                        }
                        onDirectWhatsAppCheckout(product, selectedSize, quantity, waName, waAddress);
                        setIsWhatsAppFlow(false);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-[9px] tracking-widest uppercase py-2.5 rounded-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <span>ORDER NOW</span>
                    </button>
                  </div>
                </div>
              ) : isOutOfStock ? (
                <button
                  disabled
                  className="w-full bg-zinc-900 text-zinc-500 py-4 text-xs font-bold tracking-widest uppercase cursor-not-allowed border border-zinc-800/50"
                >
                  SOLD OUT
                </button>
              ) : isSelectedSizeOutOfStock ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full bg-zinc-900 text-zinc-500 py-4 text-xs font-bold tracking-widest uppercase cursor-not-allowed border border-zinc-800/50 flex items-center justify-center space-x-2"
                  >
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    <span>MAX STOCK ADDED TO BAG</span>
                  </button>
                  <p className="font-mono text-[9px] text-zinc-500 text-center uppercase">
                    You have added all available stock of Size {selectedSize} to your cart.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={handleAdd}
                    id="btn-add-to-bag"
                    className={`w-full py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <span>ADD TO BAG</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsWhatsAppFlow(true);
                      setWaError('');
                    }}
                    id="btn-whatsapp-direct-checkout"
                    className="w-full bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-800/80 text-emerald-400 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 rounded-sm"
                  >
                    <svg className="h-4 w-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                    </svg>
                    <span>BUY WITH WHATSAPP</span>
                  </button>
                </div>
              )}

              <div className="flex justify-center items-center gap-6 text-center font-mono text-[9px] text-zinc-500 uppercase mt-4" id="shipping-details-ribbon">
                <span>✓ FREE SHIPPING OVER ₦50,000</span>
                <span>•</span>
                <span>✓ EASY RETURNS</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
