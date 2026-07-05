import { ShoppingBag, Shield, Home, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
  currentView: 'home' | 'gallery';
  onViewChange: (view: 'home' | 'gallery') => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  isAdmin,
  onAdminToggle,
  currentView,
  onViewChange
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="nav-container">
        <div className="flex h-20 items-center justify-between" id="nav-wrapper">
          
          {/* Brand Logo & Editorial Heading */}
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            id="nav-logo-group"
            onClick={() => onViewChange('home')}
          >
            <div className="flex flex-col" id="brand-logo-text">
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-widest text-white leading-none">
                T I M E L I N E
              </span>
              <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-500 mt-1 uppercase">
                STUDIO APPAREL
              </span>
            </div>
            
            {/* Mobile / Desktop Friendly Greeter */}
            <div className="hidden sm:flex items-center border-l border-zinc-900 pl-4 h-6" id="nav-user-greeting">
              <span className="font-mono text-[8.5px] text-zinc-500 tracking-wider uppercase">
                MEMBER // <span className="text-zinc-300">AYOBAMI</span>
              </span>
            </div>
          </div>

          {/* Desktop & Mobile Friendly Central Nav Buttons */}
          <div className="flex items-center space-x-6 sm:space-x-8" id="nav-central-links">
            <button
              onClick={() => onViewChange('home')}
              className={`relative py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                currentView === 'home'
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span>HOME</span>
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-emerald-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onViewChange('gallery')}
              className={`relative py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                currentView === 'gallery'
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span>GALLERY</span>
              {currentView === 'gallery' && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-emerald-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Right Accessories (Admin, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-4" id="nav-accessories-right">
            
            {/* Admin Management Toggle */}
            <button
              onClick={onAdminToggle}
              id="btn-admin-toggle"
              title="Toggle Store Manager Console"
              className={`flex items-center space-x-1.5 border px-2.5 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all duration-300 rounded-sm ${
                isAdmin
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">{isAdmin ? 'CLOSE' : 'ADMIN'}</span>
            </button>

            {/* Shopping Bag */}
            <button
              onClick={onCartClick}
              id="btn-cart-open"
              className="group relative flex items-center p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span
                  id="badge-cart-count"
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 font-mono text-[9px] font-black text-white ring-2 ring-zinc-950 animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
