import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, CreditCard, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Bolt E-Commerce - Home',
  description: 'Your one-stop shop for the latest electronics and gadgets.',
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center">
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-lg shadow-xl mb-16">
        <Image
          src="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Hero Background"
          fill
          priority
          className="object-cover blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 text-white p-8 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up">
            Discover Your Next Favorite Gadget
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up delay-200">
            Explore a curated collection of cutting-edge electronics, designed to elevate your everyday.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-400">
              Shop All Products
            </Button>
          </Link>
        </div>
      </section>

      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl border-2 border-primary/20">
          <ShoppingCart className="h-12 w-12 text-primary mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Wide Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">From headphones to laptops, find everything you need.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl border-2 border-primary/20">
          <Package className="h-12 w-12 text-primary mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Fast Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Get your orders delivered quickly and reliably.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl border-2 border-primary/20">
          <CreditCard className="h-12 w-12 text-primary mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Secure Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Powered by Stripe for safe and easy transactions.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl border-2 border-primary/20">
          <ShieldCheck className="h-12 w-12 text-primary mb-4" />
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quality Guaranteed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Only the best products from trusted brands.</p>
          </CardContent>
        </Card>
      </section>

      <section className="w-full max-w-6xl bg-gradient-to-br from-primary to-accent text-white p-12 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-left md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-lg opacity-90">
            Don't miss out on the latest tech. Browse our collection and find something amazing today!
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-primary-foreground hover:bg-secondary/80 transition-all duration-300 transform hover:scale-105">
              Start Shopping Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
