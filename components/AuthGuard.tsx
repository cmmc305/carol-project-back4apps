// src/components/AuthGuard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Parse from '@/utils/back4app'; // Importe a instância já inicializada
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = Parse.User.currentAsync ? await Parse.User.currentAsync() : Parse.User.current();
        if (!currentUser) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;