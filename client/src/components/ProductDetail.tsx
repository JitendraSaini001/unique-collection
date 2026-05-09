import React, { useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Share2, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const SIZE_CHART = {
  XS: { bust: '32"', waist: '24"', hip: '34"' },
  S: { bust: '34"', waist: '26"', hip: '36"' },
  M: { bust: '36"', waist: '28"', hip: '38"' },
  L: { bust: '38"', waist: '30"', hip: '40"' },
  XL: { bust: '40"', waist: '32"', hip: '42"' },
};

const MATERIAL_INFO: Record<string, { description: string; care: string }> = {
  silk: {
    description: 'Pure mulberry silk with a characteristic natural sheen and exceptionally smooth hand-feel.',
    care: 'Dry clean only. Store hanging. Iron on low heat with cloth.'
  },
  denim: {
    description: 'Heavyweight selvedge denim, crafted for durability and timeless character.',
    care: 'Machine wash cold inside out. Hang dry. Do not bleach.'
  },
  cotton: {
    description: 'Extra-long staple cotton for superior softness and lasting breathability.',
    care: 'Machine wash at 30°C. Tumble dry low. Iron on medium heat.'
  },
  wool: {
    description: 'Premium merino wool providing exceptional warmth-to-weight ratio.',
    care: 'Hand wash cold. Lay flat to dry. Do not wring.'
  },
  linen: {
    description: 'Fine European linen, naturally cooling and beautifully textured.',
    care: 'Machine wash cold, gentle cycle. Line dry. Iron while damp.'
  },
  polyester: {
    description: 'High-performance technical fabric designed for fluid movement.',
    care: 'Machine wash cold. Do not iron. Do not dry clean.'
  },
  velvet: {
    description: 'Rich velvet with deep pile for a luxurious feel and elegant drape.',
    care: 'Dry clean only. Steam to remove wrinkles. Store hanging.'
  },
  satin: {
    description: 'Lustrous satin weave with a smooth, glossy surface finish.',
    care: 'Hand wash cold. Do not wring. Iron on lowest setting.'
  },
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'material' | 'shipping'>('details');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedSize}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      image: product.imageUrl,
    };

    addItem(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (priceInCents: number) => {
    return `₹${(priceInCents / 100).toLocaleString('en-IN')}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.description });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const materialKey = product.material.toLowerCase();
  const materialData = MATERIAL_INFO[materialKey] || { description: 'Premium ethical material', care: 'Follow label instructions.' };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-obsidian rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden border border-white/10 flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 glass-obsidian rounded-full hover:bg-white hover:text-black transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 h-56 md:h-auto relative overflow-hidden bg-zinc-950 flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-zinc-800" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
          
          {/* Share button */}
          <button 
            onClick={handleShare}
            className="absolute bottom-4 right-4 p-2.5 glass-obsidian rounded-full hover:bg-white/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="space-y-6 flex-1">
            {/* Header */}
            <div>
              <span className="text-accent font-bold tracking-[0.4em] text-[9px] uppercase mb-2 block">
                {product.occasion} collection
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white">{formatPrice(product.price)}</span>
                <span className="px-2 py-0.5 border border-white/10 rounded-full text-[9px] font-bold tracking-widest text-white/40 uppercase">
                  Incl. GST
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {(['details', 'material', 'shipping'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                    activeTab === tab ? 'bg-accent text-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[80px]">
              {activeTab === 'details' && (
                <p className="text-white/50 font-light leading-relaxed text-sm">
                  {product.description}
                  <br /><br />
                  <span className="text-white/30">Color: {product.color} · Material: {product.material}</span>
                </p>
              )}
              {activeTab === 'material' && (
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="font-bold text-xs mb-1 uppercase tracking-widest">{product.material}</p>
                    <p className="text-xs text-white/40 font-light">{materialData.description}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="font-bold text-xs mb-1 uppercase tracking-widest text-accent">Care Instructions</p>
                    <p className="text-xs text-white/40 font-light">{materialData.care}</p>
                  </div>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-3">
                  {[
                    { icon: Truck, title: 'Free Shipping', desc: 'Complimentary shipping across India. 5-7 business days.' },
                    { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy returns within 30 days. Free return shipping.' },
                    { icon: Shield, title: 'Authentic Guarantee', desc: '100% genuine products with quality guarantee.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                      <Icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs">{title}</p>
                        <p className="text-[11px] text-white/40 font-light">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">Select Size</h4>
                <button 
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="text-[10px] font-bold text-white/40 hover:text-white underline"
                >
                  {showSizeChart ? 'HIDE' : 'SIZE CHART'}
                </button>
              </div>
              
              {showSizeChart && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px]">
                  <div className="grid grid-cols-4 gap-2 text-white/40 font-bold tracking-widest uppercase mb-2">
                    <span>Size</span><span>Bust</span><span>Waist</span><span>Hip</span>
                  </div>
                  {Object.entries(SIZE_CHART).map(([size, measurements]) => (
                    <div key={size} className={`grid grid-cols-4 gap-2 py-1 ${selectedSize === size ? 'text-accent' : 'text-white/60'}`}>
                      <span className="font-bold">{size}</span>
                      <span>{measurements.bust}</span>
                      <span>{measurements.waist}</span>
                      <span>{measurements.hip}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl font-bold text-xs transition-all ${
                      selectedSize === size
                        ? 'bg-accent text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                        : 'bg-white/5 border border-white/10 hover:border-accent/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-3 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-accent"><Minus className="w-3.5 h-3.5" /></button>
                <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-accent"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 bg-white text-black font-bold rounded-full hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-30 text-sm tracking-wider group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                ADD TO CART
              </button>
            </div>

            {/* Trust */}
            <div className="flex gap-6 text-[9px] font-bold tracking-widest text-white/25 uppercase pt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-accent rounded-full" /> Free Shipping
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-accent rounded-full" /> 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail;
