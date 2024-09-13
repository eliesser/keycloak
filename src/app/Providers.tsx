'use client';

// imports react
import { ReactNode } from 'react';

// imports third party library
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider refetchInterval={4 * 60}>{children}</SessionProvider>;
}
