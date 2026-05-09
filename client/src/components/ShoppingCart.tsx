import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Truck, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const formatPrice = (priceInCents: number) => {
    return `₹${(priceInCents / 100).toLocaleString('en-IN')}`;
  };

  const shipping = 0; // Free shipping
  const tax = Math.round(total * 0.18); // 18% GST
  const grandTotal = total + shipping + tax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.fullName || !formData.address || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('🎉 Order placed successfully! You will receive a confirmation email shortly.');
    clearCart();
    setIsCheckout(false);
    onClose();
    setFormData({ email: '', fullName: '', phone: '', address: '', city: '', state: '', pinCode: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md glass-obsidian flex flex-col border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Your Cart</h2>
            <span className="text-xs text-white/40">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isCheckout ? (
            <form onSubmit={handleCheckout} className="p-5 space-y-3">
              <h3 className="text-sm font-bold tracking-widest uppercase text-accent mb-4">Shipping Details</h3>

              {[
                { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'Your full name' },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 9876543210' },
                { label: 'Address', key: 'address', type: 'text', placeholder: 'Street address' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">{field.label} *</label>
                  <input
                    type={field.type}
                    value={(formData as any)[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:border-accent outline-none transition-all"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'City', key: 'city', placeholder: 'City' },
                  { label: 'State', key: 'state', placeholder: 'State' },
                  { label: 'PIN', key: 'pinCode', placeholder: '110001' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={(formData as any)[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:border-accent outline-none transition-all"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCheckout(false)}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-white rounded-full font-bold text-xs tracking-widest hover:bg-white/5 transition-all"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-accent text-black rounded-full font-bold text-xs tracking-widest hover:bg-accent/90 transition-all"
                >
                  PLACE ORDER
                </button>
              </div>
            </form>
          ) : (
            <div className="p-5">
              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{item.name}</h3>
                        <p className="text-[11px] text-white/50">Size: {item.size}</p>
                        <p className="text-sm font-bold text-accent mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-white/10 rounded transition-all text-white/40 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-10 h-10 mb-3 text-white/20" />
                  <p className="text-white/40 font-light">Your cart is empty</p>
                  <button onClick={onClose} className="mt-3 text-accent text-sm font-bold underline">Continue Shopping</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Order Summary */}
        {items.length > 0 && !isCheckout && (
          <div className="border-t border-white/10 p-5 space-y-3 bg-black/30">
            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-accent">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckout(true)}
              className="w-full py-3.5 bg-accent text-black rounded-full font-bold text-sm tracking-widest transition-all hover:bg-accent/90 flex items-center justify-center gap-2"
            >
              CHECKOUT
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-white/10 text-white rounded-full font-bold text-xs tracking-widest hover:bg-white/5 transition-all"
            >
              CONTINUE SHOPPING
            </button>

            {/* Trust */}
            <div className="flex justify-center gap-4 pt-1">
              <div className="flex items-center gap-1 text-[9px] text-white/30 font-bold tracking-widest uppercase">
                <Shield className="w-3 h-3" /> Secure Checkout
              </div>
              <div className="flex items-center gap-1 text-[9px] text-white/30 font-bold tracking-widest uppercase">
                <Truck className="w-3 h-3" /> Free Returns
              </div>
            </div>
          </div>
        )}

        {isCheckout && items.length > 0 && (
          <div className="border-t border-white/10 p-5 bg-black/30">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Order Total</span>
              <span className="text-accent">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
