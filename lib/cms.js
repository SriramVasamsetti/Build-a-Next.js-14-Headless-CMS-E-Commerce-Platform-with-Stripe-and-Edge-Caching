import { createClient } from '@sanity/client';
import { unstable_cache } from 'next/cache';

const sanityClient = createClient({
  projectId: process.env.CMS_PROJECT_ID || 'your-sanity-project-id', // Replace with your Sanity Project ID
  dataset: process.env.CMS_DATASET || 'production',
  apiVersion: '2023-08-01',
  useCdn: true, // `false` if you want to ensure fresh data
  token: process.env.CMS_API_KEY, // Only if your dataset is private
});

// Helper to fetch all products from Sanity
export const getSanityProducts = unstable_cache(
  async () => {
    const query = `*[_type == "product"]{
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      stock,
      "image": images[0].asset->url, // Assuming images is an array and we take the first one
      variants, // If you have variants
      _updatedAt
    }`;
    const products = await sanityClient.fetch(query);
    return products.map(p => ({
      ...p,
      id: p._id, // Map _id to id for Prisma compatibility
      updatedAt: p._updatedAt,
    }));
  },
  ['sanity-products'],
  {
    tags: ['products'],
    revalidate: 60, // Revalidate every 60 seconds
  }
);

// Helper to fetch a single product by slug from Sanity
export const getSanityProductBySlug = unstable_cache(
  async (slug) => {
    const query = `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      stock,
      "image": images[0].asset->url,
      variants,
      _updatedAt
    }`;
    const product = await sanityClient.fetch(query, { slug });
    if (product) {
      return {
        ...product,
        id: product._id,
        updatedAt: product._updatedAt,
      };
    }
    return null;
  },
  ['sanity-product-by-slug'],
  {
    tags: ['products'],
    revalidate: 60,
  }
);

// Helper to fetch a single product by ID from Sanity
export const getSanityProductById = unstable_cache(
  async (id) => {
    const query = `*[_type == "product" && _id == $id][0]{
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      stock,
      "image": images[0].asset->url,
      variants,
      _updatedAt
    }`;
    const product = await sanityClient.fetch(query, { id });
    if (product) {
      return {
        ...product,
        id: product._id,
        updatedAt: product._updatedAt,
      };
    }
    return null;
  },
  ['sanity-product-by-id'],
  {
    tags: ['products'],
    revalidate: 60,
  }
);
