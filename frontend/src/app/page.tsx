'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.push(user ? '/dashboard' : '/login');
  }, [user, loading, router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full brand-gradient opacity-70 blur-lg animate-pulse" />
        <div className="absolute inset-0 rounded-full border-[3px] border-brand-500/20 border-t-brand-500 animate-spin" />
      </div>
    </div>
  );
}
