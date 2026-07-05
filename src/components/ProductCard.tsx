import { Product } from '../types';
import { Sparkles, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (p: Product) => void;
  onQuickAdd: (p: Product, size: 'S' | 'M' | 'L' | 'XL') => void;
}

export default function ProductCard({ product, onSelect, onQuickAdd }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <div
      onClick={() => onSelect(product)}
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden p-3 cursor-pointer transition-all duration-300 hover:border-zinc-500 hover:shadow-2xl hover:shadow-black"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900/40 rounded-sm">
        
        {/* Grayscale hover animation + Zoom effect */}
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
        />

        {/* Dynamic Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5" id="card-badges">
          {isOutOfStock ? (
            <span className="bg-red-950/90 border border-red-800 text-red-300 font-mono text-[8px] tracking-widest px-2.5 py-1 backdrop-blur-sm rounded-sm uppercase font-bold">
              OUT OF STOCK
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 border border-amber-800 text-amber-300 font-mono text-[8px] tracking-widest px-2.5 py-1 backdrop-blur-sm rounded-sm uppercase font-medium flex items-center gap-1">
              <AlertCircle className="h-2.5 w-2.5" />
              ONLY {product.stock_quantity} LEFT
            </span>
          ) : product.price > 50000 ? (
            <span className="bg-zinc-950/90 border border-zinc-800 text-zinc-300 font-mono text-[8px] tracking-widest px-2.5 py-1 backdrop-blur-sm rounded-sm uppercase font-light flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-zinc-400" />
              PREMIUM RELEASE
            </span>
          ) : null}
        </div>

        {/* Quick Size Selection Overlay on Hover */}
        {!isOutOfStock && (
          <div
            onClick={(e) => e.stopPropagation()} // Prevent card detail pop
            className="absolute inset-x-2 bottom-2 transform translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 bg-zinc-950/95 border border-zinc-850 p-2.5 backdrop-blur-md rounded-sm flex flex-col justify-center items-center"
            id="quick-size-overlay"
          >
            <span className="font-mono text-[8px] text-zinc-500 tracking-widest uppercase mb-1.5">
              QUICK ADD SIZE:
            </span>
            <div className="flex gap-1.5 justify-center w-full" id="quick-size-chips">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onQuickAdd(product, size)}
                  id={`quick-add-${product.id}-${size}`}
                  className="h-6 w-8 text-[9px] font-mono font-bold tracking-widest text-zinc-400 hover:text-black hover:bg-white border border-zinc-800 hover:border-white transition-colors uppercase rounded-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="mt-4 flex flex-col flex-grow justify-between" id="card-details">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            {product.category}
          </span>
          <h3 className="text-zinc-100 font-light font-serif tracking-widest text-sm mt-1 uppercase group-hover:text-white transition-colors">
            {product.name}
          </h3>
          <p className="text-zinc-400 font-mono text-xs mt-1.5">₦{product.price.toLocaleString()}</p>
        </div>

        {/* Quick Add Button fallback for smaller viewports */}
        <div className="mt-4 pt-3 border-t border-zinc-900/80 flex items-center justify-between" id="card-footer">
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
            {product.sizes.join(' / ')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 group-hover:text-white group-hover:underline decoration-zinc-500 underline-offset-4 transition-colors"
          >
            VIEW DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}
