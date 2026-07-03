import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/services/productService';

export const metadata = {
  title: 'All Products - Bolt E-Commerce',
  description: 'Browse our wide selection of high-quality electronics and gadgets.',
  openGraph: {
    title: 'All Products - Bolt E-Commerce',
    description: 'Browse our wide selection of high-quality electronics and gadgets.',
    url: 'http://localhost:3000/products',
    images: [
      {
        url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Example product image
        width: 800,
        height: 600,
        alt: 'Products',
      },
    ],
  },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary-foreground">Our Products</h1>
      {products.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">No products found. Please check back later!</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
