'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CheckoutForm({ userEmail }) {
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    city: '',
    postal_code: '',
    country: 'US', // Default country
  });
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!', {
        description: 'Please add items to your cart before checking out.',
      });
      setLoading(false);
      return;
    }

    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postal_code || !shippingAddress.country) {
      toast.error('Shipping address incomplete', {
        description: 'Please fill in all shipping address fields.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shippingAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      router.push(data.sessionId ? `https://checkout.stripe.com/pay/${data.sessionId}` : `/checkout?error=true`);
      clearCart(); // Clear cart immediately after redirecting to Stripe
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed', {
        description: error.message || 'An unexpected error occurred during checkout.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={userEmail}
          readOnly
          disabled
          className="mt-1 bg-muted-foreground/10"
          data-testid="checkout-email-input"
        />
      </div>

      <div className="space-y-4" data-testid="checkout-shipping-address">
        <h3 className="text-xl font-semibold text-primary-foreground">Shipping Information</h3>
        <div>
          <Label htmlFor="line1">Address Line 1</Label>
          <Input
            id="line1"
            name="line1"
            type="text"
            value={shippingAddress.line1}
            onChange={handleAddressChange}
            required
            className="mt-1"
            placeholder="123 Main St"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              required
              className="mt-1"
              placeholder="Anytown"
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              name="postal_code"
              type="text"
              value={shippingAddress.postal_code}
              onChange={handleAddressChange}
              required
              className="mt-1"
              placeholder="12345"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            type="text"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            required
            className="mt-1"
            placeholder="US"
          />
        </div>
      </div>

      <Card className="bg-muted/20 border-dashed border-border">
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold text-primary-foreground mb-4">Order Summary</h3>
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-2">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-border p-4">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-lg font-bold text-accent">{formatCurrency(cartTotal)}</span>
        </CardFooter>
      </Card>

      <Button
        type="submit"
        className="w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
        disabled={loading || cartItems.length === 0}
        data-testid="checkout-submit-button"
      >
        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </form>
  );
}
