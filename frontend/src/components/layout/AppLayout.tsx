import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/lib';

export function AppLayout() {
  const { isLoading, signedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !signedIn) {
      navigate({ to: '/', replace: true });
    }
  }, [isLoading, signedIn, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!signedIn) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1 p-3 md:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}