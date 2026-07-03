import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/services/productService';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import { formatCurrency } from '@/lib/utils'; // Assuming a utility for currency formatting

export const revalidate = 60; // Revalidate this page every 60 seconds

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  return {
    title: `${product.name} - Bolt E-Commerce`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Bolt E-Commerce`,
      description: product.description,
      url: `http://localhost:3000/products/${product.slug}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Bolt E-Commerce`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Bolt E-Commerce',
      },
    },
  };

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 data-testid="product-title" className="text-5xl font-extrabold text-primary-foreground mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-accent mb-6" data-testid="product-price">
            {formatCurrency(product.price)}
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center gap-4 mb-8">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Product Gallery - using the main image for simplicity as Sanity integration is simulated */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-primary-foreground mb-8 text-center">More Views</h2>
        <ProductGallery images={[product.image, 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2']} />
      </div>
    </div>
  );
}
