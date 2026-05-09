import React, { useState, useEffect, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { Loader2, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
  categoryId?: number;
  color?: string;
  occasion?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  material: string;
  color: string;
  occasion: string;
  stock: number;
  featured?: number;
}

const ProductCatalog: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery(filters);
  const { data: categories } = trpc.categories.list.useQuery();

  // Listen for filter-category events from CollectionZones
  useEffect(() => {
    const handler = (e: Event) => {
      const categoryId = (e as CustomEvent).detail;
      setFilters(prev => ({ ...prev, categoryId }));
    };
    window.addEventListener('filter-category', handler);
    return () => window.removeEventListener('filter-category', handler);
  }, []);

  const uniqueColors = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p: any) => p.color)));
  }, [products]);

  const uniqueOccasions = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p: any) => p.occasion)));
  }, [products]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <section id="products-section" className="w-full py-24 px-4 bg-black">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              THE <span className="text-accent italic">COLLECTION</span>
            </h2>
            <p className="text-lg text-white/40 font-light">
              {products?.length || 0} curated pieces · Free shipping on all orders
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-accent text-black border-accent' 
                : 'glass-obsidian border-white/10 text-white hover:border-accent/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">
              {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filter'}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="glass-obsidian p-8 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-accent">Category</label>
                  <select
                    value={filters.categoryId || ''}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                  >
                    <option value="" className="bg-zinc-900">All Collections</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-accent">Color</label>
                  <select
                    value={filters.color || ''}
                    onChange={(e) => handleFilterChange('color', e.target.value || undefined)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                  >
                    <option value="" className="bg-zinc-900">All Colors</option>
                    {uniqueColors.map((color: string) => (
                      <option key={color} value={color} className="bg-zinc-900">{color}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-accent">Occasion</label>
                  <select
                    value={filters.occasion || ''}
                    onChange={(e) => handleFilterChange('occasion', e.target.value || undefined)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                  >
                    <option value="" className="bg-zinc-900">All Occasions</option>
                    {uniqueOccasions.map((occasion: string) => (
                      <option key={occasion} value={occasion} className="bg-zinc-900">{occasion}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-accent opacity-30" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product: any, index: number) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onViewDetails={(prod) => {
                  setSelectedProduct(prod);
                  setShowDetail(true);
                }}
              />
            ))}
          </div>
        )}

        {!productsLoading && (!products || products.length === 0) && (
          <div className="text-center py-24 glass-obsidian rounded-2xl border border-white/5">
            <p className="text-lg text-white/20 font-light">No pieces found matching your filters.</p>
            <button onClick={handleClearFilters} className="mt-3 text-accent text-sm font-bold underline">View All Products</button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => {
              setShowDetail(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductCatalog;
