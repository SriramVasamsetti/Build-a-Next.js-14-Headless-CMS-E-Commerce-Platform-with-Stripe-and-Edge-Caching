import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createOrder } from '@/services/orderService';
import { clearCart } from '@/services/cartService'; // Assuming a server-side clear cart function

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);

      // Retrieve metadata
      const userId = session.metadata.userId;
      const cartItems = JSON.parse(session.metadata.cartItems);
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);
      const total = session.amount_total / 100; // Convert cents to dollars

      if (!userId || !cartItems || cartItems.length === 0) {
        console.error('Missing userId or cartItems in session metadata.');
        return NextResponse.json({ message: 'Missing metadata' }, { status: 400 });
      }

      try {
        await createOrder(userId, total, session.payment_intent, cartItems, shippingAddress);
        await clearCart(userId); // Clear the user's cart after successful order
        console.log(`Order created for user ${userId} with payment intent ${session.payment_intent}`);
      } catch (orderError) {
        console.error('Error creating order:', orderError);
        // You might want to implement a retry mechanism or alert system here
        return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
      }
      break;
    // Add other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
