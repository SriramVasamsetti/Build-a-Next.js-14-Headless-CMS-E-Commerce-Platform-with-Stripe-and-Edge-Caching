'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

export default function CartIndicator() {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Link href="/checkout" className="relative">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-6 w-6 text-primary-foreground" />
        {itemCount > 0 && (
          <span
            data-testid="cart-item-count"
            className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
          >
            {itemCount}
          </span>
        )}
        <span className="sr-only">Cart ({itemCount} items)</span>
      </Button>
    </Link>
  );
}
