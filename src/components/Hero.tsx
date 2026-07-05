import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-zinc-950 border-b border-zinc-900" id="hero-section">
      
      {/* Decorative subtle lighting gradients */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-zinc-800/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-zinc-900/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-grid">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8" id="hero-info-panel">

            <div className="space-y-4" id="hero-headlines">
              <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-tight text-white leading-[1.05]">
                TIMELINE <br />
                <span className="italic font-normal text-zinc-400">CHRISTIAN</span> <br />
                APPAREL.
              </h1>
              <p className="max-w-lg text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
                Premium, high-quality Christian-inspired fashion. Thoughtfully designed with first-class fabrics and premium combed cottons to inspire believers to live with faith and confidence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4" id="hero-ctas">
              <button
                onClick={onExploreClick}
                className="group relative flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300"
              >
                <span>EXPLORE SHOP</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#product-grid-section"
                className="flex items-center justify-center border border-zinc-800 px-8 py-4 text-xs font-mono tracking-widest text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                VIEW PRODUCTS
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900/80 font-mono text-left" id="hero-stats">
              <div>
                <span className="block text-lg font-medium text-white">100%</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Premium Cotton</span>
              </div>
              <div>
                <span className="block text-lg font-medium text-white">HIGH</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Quality Fabric</span>
              </div>
              <div>
                <span className="block text-lg font-medium text-white">FAST</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Courier Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Right Media Panel */}
          <div className="lg:col-span-5 relative" id="hero-media-panel">
            <div className="aspect-[3/4] overflow-hidden bg-zinc-900 border border-zinc-800/80 rounded-sm relative group">
              
              {/* Image with sleek overlay */}
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                alt="High-end dark minimalist fashion lookbook"
                className="h-full w-full object-cover grayscale brightness-[0.7] contrast-110 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent opacity-90" />
              
              {/* Editorial Captions */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end" id="hero-lookbook-cap">
                <div>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase">
                    NEW COLLECTION // 2025
                  </span>
                  <span className="font-serif text-lg italic text-white font-light">
                    Faith & Fashion
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 border border-zinc-800/80 bg-zinc-950/80 px-2.5 py-1 backdrop-blur-sm rounded-sm">
                  ED. 01 / 500
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
