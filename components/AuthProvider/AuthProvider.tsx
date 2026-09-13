'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await checkSession();
        if (response && response.status === 200) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        clearIsAuthenticated();
      }
      router.refresh();
    };

    initAuth();
  }, [setUser, clearIsAuthenticated, router]);

  return <>{children}</>;
};
