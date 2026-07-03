import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CheckoutForm from '@/components/CheckoutForm';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export const metadata = {
  title: 'Checkout - Bolt E-Commerce',
  description: 'Complete your purchase securely.',
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary-foreground">Secure Checkout</h1>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg rounded-xl border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold">Your Order Details</CardTitle>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <CheckoutForm userEmail={session.user.email} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
