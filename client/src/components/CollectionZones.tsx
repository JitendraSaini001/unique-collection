import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const CollectionZones: React.FC = () => {
  const { data: categories } = trpc.categories.list.useQuery();

  if (!categories || categories.length === 0) return null;

  const scrollToProducts = (categoryId?: number) => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Dispatch a custom event to set the filter
      if (categoryId) {
        window.dispatchEvent(new CustomEvent('filter-category', { detail: categoryId }));
      }
    }
  };

  return (
    <section id="zones-section" className="relative w-full py-24 px-4 bg-black">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              CURATED <span className="text-accent italic">ZONES</span>
            </h2>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              Three distinct style universes, each meticulously designed to 
              define a unique facet of the modern woman's wardrobe.
            </p>
          </div>
          <div className="hidden md:block pb-2">
            <button 
              onClick={() => scrollToProducts()}
              className="px-8 py-4 glass-obsidian rounded-full text-sm font-bold tracking-widest hover:bg-accent hover:text-black transition-all"
            >
              VIEW ALL
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[700px]">
          {/* Main Large Zone (Casual) */}
          <div 
            className="md:col-span-8 group relative overflow-hidden rounded-2xl border border-white/5 h-[350px] md:h-full cursor-pointer"
            onClick={() => scrollToProducts(categories[0]?.id)}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${categories[0]?.image || '/images/casual.png'}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
              <div className="max-w-md">
                <span className="text-accent font-bold tracking-[0.3em] text-xs mb-3 block uppercase">01 / {categories[0]?.name}</span>
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{categories[0]?.description}</h3>
                <button className="flex items-center gap-2 px-5 py-2.5 glass-obsidian rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all">
                  EXPLORE <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="md:col-span-4 flex flex-col gap-4 h-full">
            {/* Formal Zone */}
            <div 
              className="flex-1 group relative overflow-hidden rounded-2xl border border-white/5 min-h-[250px] cursor-pointer"
              onClick={() => scrollToProducts(categories[1]?.id)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${categories[1]?.image || '/images/formal.png'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-accent font-bold tracking-[0.3em] text-xs mb-2 block uppercase">02 / {categories[1]?.name}</span>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{categories[1]?.name}</h3>
                <button className="p-2.5 glass-obsidian rounded-full hover:bg-accent hover:text-black transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Streetwear Zone */}
            <div 
              className="flex-1 group relative overflow-hidden rounded-2xl border border-white/5 min-h-[250px] cursor-pointer"
              onClick={() => scrollToProducts(categories[2]?.id)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${categories[2]?.image || '/images/streetwear.png'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-accent font-bold tracking-[0.3em] text-xs mb-2 block uppercase">03 / {categories[2]?.name}</span>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{categories[2]?.name}</h3>
                <button className="p-2.5 glass-obsidian rounded-full hover:bg-accent hover:text-black transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionZones;
