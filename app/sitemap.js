import { getProductsForSitemap } from '@/services/productService';

const URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export default async function sitemap() {
  const products = await getProductsForSitemap();

  const productEntries = products.map(({ slug, updatedAt }) => ({
    url: `${URL}/products/${slug}`,
    lastModified: updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: `${URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productEntries,
  ];
}
