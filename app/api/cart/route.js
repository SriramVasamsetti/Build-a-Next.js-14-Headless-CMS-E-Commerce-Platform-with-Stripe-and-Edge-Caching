import { NextResponse } from 'next/server';
import { getCart, updateCart } from '@/services/cartService';

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { productId, quantity } = await req.json();
    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const updatedCart = await updateCart(productId, quantity);
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
  }
}
