import { useState } from 'react';
import { ShoppingBag, Shield, Menu, X, ChevronRight, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="nav-container">
          <div className="flex h-20 items-center justify-between" id="nav-wrapper">
            
            {/* Brand Logo & Editorial Heading */}
            <div 
              className="flex items-center gap-4 cursor-pointer" 
              id="nav-logo-group"
              onClick={() => {
                onViewChange('home');
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="flex flex-col" id="brand-logo-text">
                <span className="font-serif text-xl sm:text-2xl font-semibold tracking-widest text-white leading-none">
                  T I M E L I N E
                </span>
                <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-500 mt-1 uppercase">
                  STUDIO APPAREL
                </span>
              </div>
            </div>

            {/* Desktop Only Central Nav Buttons */}
            <div className="hidden md:flex items-center space-x-8" id="nav-central-links">
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

            {/* Right Accessories (Admin, Cart, Hamburger Toggle) */}
            <div className="flex items-center space-x-2.5 sm:space-x-4" id="nav-accessories-right">
              
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

              {/* Mobile Menu Hamburger Trigger (Only visible on mobile/tablet) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                id="btn-mobile-menu-open"
                aria-label="Open Navigation Menu"
                className="md:hidden flex h-9 w-9 items-center justify-center border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-sm transition-all"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden" id="mobile-drawer-portal">
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              id="mobile-drawer-backdrop"
            />

            {/* Sidebar content container */}
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="w-72 sm:w-80 max-w-md bg-zinc-950 border-l border-zinc-900 text-zinc-100 flex flex-col justify-between"
                id="mobile-drawer-body"
              >
                {/* Header Row */}
                <div className="p-6 border-b border-zinc-900 flex items-center justify-between" id="drawer-header">
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-semibold tracking-widest text-white leading-none">
                      TIMELINE
                    </span>
                    <span className="font-mono text-[7px] tracking-[0.3em] text-zinc-500 mt-1 uppercase">
                      STUDIO CATALOG
                    </span>
                  </div>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    id="btn-mobile-menu-close"
                    aria-label="Close navigation menu"
                    className="flex h-9 w-9 items-center justify-center border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white rounded-sm transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <div className="px-6 py-8 flex-grow space-y-8" id="drawer-links-container">
                  <div className="space-y-4">
                    <span className="block font-mono text-[8px] tracking-[0.25em] text-zinc-600 uppercase font-semibold">
                      NAVIGATION PORTALS
                    </span>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          onViewChange('home');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 border rounded-sm transition-all ${
                          currentView === 'home'
                            ? 'bg-zinc-900 border-zinc-800 text-white font-semibold'
                            : 'bg-zinc-950/20 border-zinc-900/40 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="font-serif text-sm tracking-wider uppercase">HOME ARCHIVE</span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                      </button>

                      <button
                        onClick={() => {
                          onViewChange('gallery');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 border rounded-sm transition-all ${
                          currentView === 'gallery'
                            ? 'bg-zinc-900 border-zinc-800 text-white font-semibold'
                            : 'bg-zinc-950/20 border-zinc-900/40 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="font-serif text-sm tracking-wider uppercase">EXPLORE GALLERY</span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                      </button>
                    </div>
                  </div>

                  {/* Brand & Studio Info block */}
                  <div className="border border-zinc-900 bg-zinc-900/10 p-4 rounded-sm space-y-3.5" id="drawer-member-card">
                    <div className="flex items-center space-x-2 text-zinc-300">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
                        STUDIO VISITOR
                      </span>
                    </div>
                    <p className="font-mono text-[8px] text-zinc-500 uppercase leading-relaxed">
                      WELCOME TO TIMELINE. ENJOY SECURE WHATSAPP CHECKOUT WITH DIRECT, PRIORITY DISPATCH ON ALL CUSTOM ORDERS.
                    </p>
                  </div>

                  {/* Faith Statement Badge */}
                  <div className="flex items-center space-x-2 text-zinc-600 px-1" id="drawer-faith-badge">
                    <Sparkles className="h-3 w-3 text-amber-500/60" />
                    <span className="font-mono text-[8px] tracking-wider uppercase">
                      WEAR YOUR VALUES // WALK BY FAITH
                    </span>
                  </div>
                </div>

                {/* Footer Section inside Drawer */}
                <div className="p-6 border-t border-zinc-900 bg-zinc-900/10 space-y-2.5" id="drawer-footer">
                  <div className="flex justify-between items-center text-[8px] font-mono text-zinc-600 uppercase">
                    <span>DEVELOPER REGISTRY</span>
                    <span>2026 // ED.</span>
                  </div>
                  
                  {/* Quick toggle to trigger Admin panel inside drawer */}
                  <button
                    onClick={() => {
                      onAdminToggle();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-[9px] font-mono tracking-widest uppercase py-3 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-sm"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>{isAdmin ? 'DEAUTHORIZE ADMIN' : 'STORE MANAGER LOGIN'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
