import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const createCartStore = () => create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,

      addToCart: (product) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return {
              items: updatedItems,
              itemCount: state.itemCount + 1,
              total: state.total + product.price,
            };
          } else {
            // New item
            return {
              items: [...state.items, { ...product, quantity: 1 }],
              itemCount: state.itemCount + 1,
              total: state.total + product.price,
            };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const itemToRemove = state.items.find((item) => item.id === productId);
          if (!itemToRemove) return state;

          const updatedItems = state.items.filter((item) => item.id !== productId);
          return {
            items: updatedItems,
            itemCount: state.itemCount - itemToRemove.quantity,
            total: state.total - (itemToRemove.price * itemToRemove.quantity),
          };
        });
      },

      updateQuantity: (productId, newQuantity) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === productId);
          if (existingItemIndex === -1) return state;

          const oldQuantity = state.items[existingItemIndex].quantity;
          const price = state.items[existingItemIndex].price;

          const updatedItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: newQuantity }
              : item
          );

          const newItemCount = state.itemCount - oldQuantity + newQuantity;
          const newTotal = state.total - (price * oldQuantity) + (price * newQuantity);

          return {
            items: updatedItems.filter(item => item.quantity > 0), // Remove if quantity becomes 0
            itemCount: newItemCount,
            total: newTotal,
          };
        });
      },

      clearCart: () => set({ items: [], itemCount: 0, total: 0 }),
    }),
    {
      name: 'bolt-ecommerce-cart', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

// Export a hook for direct use in client components
export const useCartStore = createCartStore();
