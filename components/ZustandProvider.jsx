'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createCartStore } from '@/store/cartStore';

export const ZustandContext = createContext(null);

export default function ZustandProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  return (
    <ZustandContext.Provider value={storeRef.current}>
      {children}
    </ZustandContext.Provider>
  );
}

export const useZustandStore = (selector) => {
  const store = useContext(ZustandContext);
  if (!store) {
    throw new Error('useZustandStore must be used within a ZustandProvider');
  }
  return useStore(store, selector);
};
