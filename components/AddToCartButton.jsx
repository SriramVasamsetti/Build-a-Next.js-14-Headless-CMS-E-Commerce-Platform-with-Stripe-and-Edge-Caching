'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function AddToCartButton({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock!', {
        description: `${product.name} is currently unavailable.`,
      });
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: `You now have ${useCartStore.getState().items.find(item => item.id === product.id)?.quantity || 1} of this item.`,
    });
  };

  return (
    <Button
      data-testid="add-to-cart-button"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <ShoppingCart className="h-5 w-5" />
      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  );
}
