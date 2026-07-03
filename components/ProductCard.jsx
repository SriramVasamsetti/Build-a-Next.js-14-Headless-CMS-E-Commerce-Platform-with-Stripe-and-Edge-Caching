import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddToCartButton from '@/components/AddToCartButton';
import { formatCurrency } from '@/lib/utils';

export default function ProductCard({ product }) {
  return (
    <Card data-testid={`product-card-${product.id}`} className="flex flex-col h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-border/50">
      <Link href={`/products/${product.slug}`} className="relative block h-60 w-full overflow-hidden rounded-t-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={true}
        />
      </Link>
      <CardHeader className="flex-grow">
        <CardTitle className="text-xl font-semibold text-primary-foreground line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <p className="text-2xl font-bold text-accent mb-2">{formatCurrency(product.price)}</p>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </span>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <AddToCartButton product={product} />
        <Link href={`/products/${product.slug}`}>
          <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
