import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT } from '@constants/student';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (product: Omit<CartItem, 'quantity'>) => void;
  remove: (id: number) => void;
  changeQty: (id: number, qty: number) => void;
  clear: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

const CART_KEY = `ktxgo-cart-${STUDENT.mssv}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) => {
        set(state => {
          const existing = state.items.find(i => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      remove: (id) => {
        set(state => ({ items: state.items.filter(i => i.id !== id) }));
      },

      changeQty: (id, qty) => {
        if (qty <= 0) {
          get().remove(id);
          return;
        }
        set(state => ({
          items: state.items.map(i => (i.id === id ? { ...i, quantity: qty } : i)),
        }));
      },

      clear: () => set({ items: [] }),

      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: CART_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
