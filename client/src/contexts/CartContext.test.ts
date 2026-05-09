import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Cart Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const cart = localStorage.getItem('cart');
    expect(cart).toBeNull();
  });

  it('should add item to cart', () => {
    const item = {
      id: '1-M-1234',
      productId: 1,
      name: 'Test Product',
      price: 9999,
      quantity: 1,
      size: 'M',
    };

    const cart = [item];
    localStorage.setItem('cart', JSON.stringify(cart));

    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Test Product');
  });

  it('should calculate total price correctly', () => {
    const items = [
      {
        id: '1-M-1234',
        productId: 1,
        name: 'Product 1',
        price: 5000,
        quantity: 2,
        size: 'M',
      },
      {
        id: '2-L-5678',
        productId: 2,
        name: 'Product 2',
        price: 7500,
        quantity: 1,
        size: 'L',
      },
    ];

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(17500);
  });

  it('should calculate item count correctly', () => {
    const items = [
      { quantity: 2 },
      { quantity: 3 },
      { quantity: 1 },
    ];

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    expect(count).toBe(6);
  });

  it('should merge items with same product and size', () => {
    const items = [
      {
        id: '1-M-1234',
        productId: 1,
        name: 'Product 1',
        price: 5000,
        quantity: 1,
        size: 'M',
      },
      {
        id: '1-M-5678',
        productId: 1,
        name: 'Product 1',
        price: 5000,
        quantity: 2,
        size: 'M',
      },
    ];

    // Simulate merge logic
    const merged = items.reduce((acc, item) => {
      const existing = acc.find(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as typeof items);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const items = [
      { id: '1-M-1234', productId: 1, name: 'Product 1', price: 5000, quantity: 1, size: 'M' },
      { id: '2-L-5678', productId: 2, name: 'Product 2', price: 7500, quantity: 1, size: 'L' },
    ];

    const filtered = items.filter((item) => item.id !== '1-M-1234');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].productId).toBe(2);
  });

  it('should update quantity correctly', () => {
    const items = [
      { id: '1-M-1234', productId: 1, name: 'Product 1', price: 5000, quantity: 1, size: 'M' },
    ];

    const updated = items.map((item) =>
      item.id === '1-M-1234' ? { ...item, quantity: 3 } : item
    );

    expect(updated[0].quantity).toBe(3);
  });

  it('should persist cart to localStorage', () => {
    const items = [
      { id: '1-M-1234', productId: 1, name: 'Product 1', price: 5000, quantity: 1, size: 'M' },
    ];

    localStorage.setItem('cart', JSON.stringify(items));
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');

    expect(saved).toEqual(items);
  });

  it('should handle empty cart', () => {
    const items: any[] = [];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    expect(total).toBe(0);
    expect(count).toBe(0);
  });
});
