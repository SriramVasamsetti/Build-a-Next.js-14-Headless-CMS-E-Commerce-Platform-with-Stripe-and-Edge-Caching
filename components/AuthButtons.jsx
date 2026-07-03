'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="outline" className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    );
  }
  return (
    <Button onClick={() => signIn()} variant="default" className="flex items-center gap-2">
      <LogIn className="h-4 w-4" />
      Sign In
    </Button>
  );
}
