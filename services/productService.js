import prisma from '@/lib/prisma';
import { getSanityProducts, getSanityProductBySlug, getSanityProductById } from '@/lib/cms';
import { cachedFunction } from '@/lib/cache';

// Fetch all products from Sanity (cached)
export const getProducts = cachedFunction(
  async () => {
    const products = await getSanityProducts();
    return products;
  },
  ['all-products'],
  {
    tags: ['products'],
    revalidate: 60, // Revalidate every 60 seconds
  }
);

// Fetch a single product by slug from Sanity (cached)
export const getProductBySlug = cachedFunction(
  async (slug) => {
    const product = await getSanityProductBySlug(slug);
    return product;
  },
  ['product-by-slug'],
  {
    tags: ['products'],
    revalidate: 60,
  }
);

// Fetch a single product by ID from Sanity (cached)
export const getProductById = cachedFunction(
  async (id) => {
    const product = await getSanityProductById(id);
    return product;
  },
  ['product-by-id'],
  {
    tags: ['products'],
    revalidate: 60,
  }
);

// Fetch products for sitemap generation (cached)
export const getProductsForSitemap = cachedFunction(
  async () => {
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });
    return products;
  },
  ['sitemap-products'],
  {
    tags: ['products'],
    revalidate: 3600, // Revalidate sitemap products less frequently
  }
);
