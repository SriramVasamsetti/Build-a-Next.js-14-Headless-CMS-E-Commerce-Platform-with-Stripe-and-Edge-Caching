import prisma from '@/lib/prisma';
import { getProductById } from '@/services/productService';

/**
 * Creates a new order and associated order items in the database.
 * Also updates product stock.
 * @param {string} userId The ID of the user placing the order.
 * @param {number} total The total amount of the order.
 * @param {string} stripePaymentIntentId The Stripe Payment Intent ID.
 * @param {Array<Object>} cartItems An array of cart items, each with productId, name, quantity, and price.
 * @param {Object} shippingAddress The shipping address details.
 * @returns {Promise<Object>} The created order.
 */
export async function createOrder(userId, total, stripePaymentIntentId, cartItems, shippingAddress) {
  if (!userId || !total || !stripePaymentIntentId || !cartItems || cartItems.length === 0) {
    throw new Error('Missing required order details.');
  }

  // Start a Prisma transaction to ensure atomicity
  const order = await prisma.$transaction(async (tx) => {
    // 1. Create the Order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        stripePaymentIntentId,
        status: 'completed', // Mark as completed after successful Stripe payment
        // In a real app, you might store shippingAddress details in a separate model or JSON field
      },
    });

    // 2. Create OrderItems and update Product stock
    for (const item of cartItems) {
      const product = await getProductById(item.id); // Fetch product from CMS/DB to get current stock

      if (!product || product.stock < item.quantity) {
        throw new Error(`Product ${item.name} is out of stock or insufficient quantity.`);
      }

      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.id,
          quantity: item.quantity,
          price: product.price, // Use current product price from DB/CMS
        },
      });

      // Decrement product stock
      await tx.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newOrder;
  });

  return order;
}

/**
 * Retrieves an order by its ID.
 * @param {string} orderId The ID of the order to retrieve.
 * @returns {Promise<Object|null>} The order object or null if not found.
 */
export async function getOrderById(orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
}

/**
 * Retrieves all orders for a specific user.
 * @param {string} userId The ID of the user.
 * @returns {Promise<Array<Object>>} An array of orders for the user.
 */
export async function getOrdersByUserId(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
