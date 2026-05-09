import React, { useState, Suspense, lazy } from 'react';
import { ShoppingBag, Menu, X, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const HeroSection = lazy(() => import('@/components/HeroSection'));
const CollectionZones = lazy(() => import('@/components/CollectionZones'));
const ProductCatalog = lazy(() => import('@/components/ProductCatalog'));
const ShoppingCart = lazy(() => import('@/components/ShoppingCart'));

const SectionLoader = () => (
  <div className="w-full h-96 flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-accent/50" />
  </div>
);

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-obsidian border-b border-white/5">
        <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <div className="text-lg md:text-xl font-bold tracking-[0.4em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
            UNIQUE <span className="text-accent italic">GIRL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-12">
            <button onClick={() => scrollTo('zones-section')} className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-accent transition-all">Collections</button>
            <button onClick={() => scrollTo('products-section')} className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-accent transition-all">Shop All</button>
            <button onClick={() => scrollTo('footer-section')} className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-accent transition-all">About</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative group p-2 transition-all"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-accent transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-[10px] text-black rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-obsidian border-t border-white/5 p-6 space-y-4">
            <button onClick={() => scrollTo('zones-section')} className="block w-full text-left text-sm font-bold tracking-widest uppercase hover:text-accent transition-all py-2">Collections</button>
            <button onClick={() => scrollTo('products-section')} className="block w-full text-left text-sm font-bold tracking-widest uppercase hover:text-accent transition-all py-2">Shop All</button>
            <button onClick={() => scrollTo('footer-section')} className="block w-full text-left text-sm font-bold tracking-widest uppercase hover:text-accent transition-all py-2">About</button>
          </div>
        )}
      </nav>

      {/* Main Content — no intro gate, everything visible immediately */}
      <main className="w-full">
        <Suspense fallback={<SectionLoader />}>
          <HeroSection onIntroComplete={() => {}} />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <CollectionZones />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ProductCatalog />
        </Suspense>

        {/* Footer */}
        <footer id="footer-section" className="w-full bg-[#050505] text-white py-20 border-t border-white/5">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <div className="text-2xl font-bold tracking-[0.3em] uppercase mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  UNIQUE <span className="text-accent italic">GIRL</span>
                </div>
                <p className="text-white/40 max-w-sm font-light leading-relaxed text-sm">
                  Curated luxury fashion for the modern Indian woman. 
                  Premium fabrics, timeless designs, free shipping across India.
                </p>
                <div className="flex gap-4 mt-6">
                  {['Instagram', 'Pinterest', 'Twitter'].map(social => (
                    <button key={social} className="px-4 py-2 glass-obsidian rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-accent hover:text-black transition-all">
                      {social}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent mb-6">Quick Links</h4>
                <ul className="space-y-3 text-sm font-light text-white/60">
                  <li><button onClick={() => scrollTo('zones-section')} className="hover:text-white transition-colors">Collections</button></li>
                  <li><button onClick={() => scrollTo('products-section')} className="hover:text-white transition-colors">Shop All</button></li>
                  <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent mb-6">Support</h4>
                <ul className="space-y-3 text-sm font-light text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white/20">
              <p>&copy; 2026 UNIQUE GIRL COLLECTION. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Shopping Cart */}
      <Suspense fallback={null}>
        <ShoppingCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </Suspense>
    </div>
  );
}
