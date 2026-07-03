import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getCartItems } from '@/services/cartService';
import { getProductById } from '@/services/productService';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { shippingAddress } = await req.json(); // Assuming shipping address is passed from client

  if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postal_code || !shippingAddress.country) {
    return NextResponse.json({ message: 'Shipping address is incomplete' }, { status: 400 });
  }

  try {
    const cartItems = await getCartItems(); // Get items from Zustand store (server-side representation)
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const lineItems = [];
    for (const item of cartItems) {
      const product = await getProductById(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ message: `Product ${item.name} is out of stock or insufficient quantity` }, { status: 400 });
      }
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100), // Price in cents
        },
        quantity: item.quantity,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      metadata: {
        userId: session.user.id,
        cartItems: JSON.stringify(cartItems), // Store cart items for webhook processing
        shippingAddress: JSON.stringify(shippingAddress),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Customize allowed countries
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json({ message: 'Failed to create checkout session' }, { status: 500 });
  }
}
