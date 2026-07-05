import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeaturedCarouselProps {
  products: Product[];
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, size: 'S' | 'M' | 'L' | 'XL') => void;
  onViewAllClick: () => void;
}

export default function FeaturedCarousel({
  products,
  onSelect,
  onQuickAdd,
  onViewAllClick
}: FeaturedCarouselProps) {
  // Take first 4 items for the featured carousel
  const featuredProducts = products.slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto scroll effect every 8 seconds, pausing on hover
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || featuredProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovered, featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
  };

  const currentProduct = featuredProducts[currentIndex];
  const isOutOfStock = currentProduct.stock_quantity === 0;
  const isLowStock = currentProduct.stock_quantity > 0 && currentProduct.stock_quantity <= 5;

  // Animation variants for the carousel slider
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0
    })
  };

  return (
    <section 
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-10" 
      id="featured-carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-900 pb-5 gap-4" id="carousel-header">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wider text-white uppercase mt-1">
            SELECTED CLOTHES
          </h2>
        </div>

        <button
          onClick={onViewAllClick}
          className="group flex items-center space-x-2 text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white uppercase transition-colors self-start sm:self-auto"
        >
          <span>EXPLORE FULL GALLERY</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Main Carousel Wrapper */}
      <div className="relative bg-zinc-900/10 border border-zinc-900 rounded-sm p-4 sm:p-8 overflow-hidden min-h-[480px] sm:min-h-[500px] flex items-center" id="carousel-viewport">
        
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10">
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-850 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all active:scale-95"
            aria-label="Previous clothing release"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10">
          <button
            onClick={handleNext}
            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-850 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all active:scale-95"
            aria-label="Next clothing release"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Dynamic Slideway using framer-motion */}
        <div className="w-full max-w-5xl mx-auto px-10 sm:px-12 py-4" id="carousel-slide-content">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center"
            >
              {/* Product Image Panel */}
              <div 
                className="relative aspect-[3/4] sm:aspect-square md:aspect-[3/4] overflow-hidden bg-zinc-900/40 border border-zinc-900 rounded-sm cursor-pointer group/img"
                onClick={() => onSelect(currentProduct)}
              >
                <img
                  src={currentProduct.image_url}
                  alt={currentProduct.name}
                  className="h-full w-full object-cover transition-all duration-700 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3 left-3" id="carousel-product-badges">
                  {isOutOfStock ? (
                    <span className="bg-red-950/90 border border-red-800 text-red-300 font-mono text-[8px] tracking-widest px-2.5 py-1 backdrop-blur-sm rounded-sm uppercase font-bold">
                      OUT OF STOCK
                    </span>
                  ) : isLowStock ? (
                    <span className="bg-amber-950/90 border border-amber-800 text-amber-300 font-mono text-[8px] tracking-widest px-2.5 py-1 backdrop-blur-sm rounded-sm uppercase font-medium flex items-center gap-1">
                      <AlertCircle className="h-2.5 w-2.5" />
                      ONLY {currentProduct.stock_quantity} LEFT
                    </span>
                  ) : (
                    <span className="bg-zinc-950/90 border border-zinc-850 text-zinc-300 font-mono text-[8px] tracking-widest px-2.5 py-1 backdrop-blur-sm rounded-sm uppercase font-light">
                      SELECTED SPECIMEN
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info Panel */}
              <div className="space-y-6 text-left" id="carousel-text-panel">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block">
                    {currentProduct.category} // MODEL 0{currentIndex + 1}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white uppercase leading-tight">
                    {currentProduct.name}
                  </h3>
                  <p className="font-mono text-lg text-emerald-400 font-semibold">
                    ₦{currentProduct.price.toLocaleString()}
                  </p>
                </div>

                <p className="font-mono text-[10.5px] text-zinc-400 leading-relaxed uppercase tracking-wide border-t border-b border-zinc-900/60 py-4">
                  {currentProduct.description}
                </p>

                {/* Sizes Available */}
                <div className="space-y-2">
                  <span className="block font-mono text-[8px] tracking-widest text-zinc-500 uppercase">
                    AVAILABLE TIER SIZES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        disabled={isOutOfStock}
                        onClick={() => onQuickAdd(currentProduct, sz)}
                        className="h-8 px-4 text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white hover:bg-[#991b1b] border border-zinc-850 hover:border-[#991b1b] transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase rounded-sm"
                        title={`Quick add Size ${sz}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Call To Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2" id="carousel-actions-row">
                  <button
                    onClick={() => onSelect(currentProduct)}
                    className="flex-grow bg-[#991b1b] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#7f1d1d] py-3.5 px-6 transition-all rounded-sm text-center shadow-[0_4px_12px_rgba(153,27,27,0.2)]"
                  >
                    QUICK VIEW DETAILS
                  </button>
                  <button
                    onClick={onViewAllClick}
                    className="border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#991b1b] text-[10px] font-mono tracking-widest uppercase py-3.5 px-6 transition-all rounded-sm text-center"
                  >
                    EXPLORE SHOP
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Page Progress Indicator dots */}
      <div className="flex justify-center items-center gap-2.5 pt-2" id="carousel-indicators">
        {featuredProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentIndex ? 'w-8 bg-[#991b1b] shadow-[0_0_8px_rgba(153,27,27,0.5)]' : 'w-2 bg-zinc-800 hover:bg-zinc-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
