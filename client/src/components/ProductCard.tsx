import React, { useState } from 'react';
import { ShoppingBag, Heart, Info } from 'lucide-react';
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
  featured?: number;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  index?: number;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, index = 0 }) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [liked, setLiked] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedSize}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
      image: product.imageUrl,
    };

    addItem(cartItem);
    toast.success(`${product.name} added to cart!`);
    setShowSizeSelector(false);
  };

  const formatPrice = (priceInCents: number) => {
    return `₹${(priceInCents / 100).toLocaleString('en-IN')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative glass-obsidian rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <ShoppingBag className="w-12 h-12 text-zinc-800" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-bold tracking-widest uppercase">
            {product.material}
          </span>
          {product.featured === 1 && (
            <span className="px-2.5 py-1 bg-accent text-black rounded-full text-[9px] font-bold tracking-widest uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button 
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-2 glass-obsidian rounded-full hover:bg-white/20 transition-all"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white/70'}`} />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={() => setShowSizeSelector(true)}
            className="p-3 bg-accent text-black rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onViewDetails?.(product)}
            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
            title="View Details"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-base font-bold tracking-tight line-clamp-1">{product.name}</h3>
          <span className="text-accent font-bold text-sm whitespace-nowrap ml-2">{formatPrice(product.price)}</span>
        </div>
        
        <p className="text-white/35 text-xs mb-4 line-clamp-2 font-light leading-relaxed">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold text-white/20 tracking-[0.2em] uppercase">
            {product.color}
          </span>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${product.stock > 0 ? 'text-green-400/80' : 'text-red-400/80'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Size Selector Modal */}
      {showSizeSelector && (
        <div className="absolute inset-0 z-50 glass-obsidian p-5 flex flex-col justify-center animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-bold text-accent tracking-widest text-xs uppercase">Select Size</h4>
            <button onClick={() => setShowSizeSelector(false)} className="text-white/60 hover:text-white text-xl">&times;</button>
          </div>
          
          <div className="grid grid-cols-5 gap-1.5 mb-6">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSize === size ? 'bg-accent text-black' : 'bg-white/5 border border-white/10 hover:border-accent'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-3.5 bg-white text-black font-bold rounded-full hover:bg-accent transition-colors disabled:opacity-30 text-sm tracking-wider"
          >
            ADD TO CART — {formatPrice(product.price)}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
