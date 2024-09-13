'use client';

// imports react
import { ReactNode, useEffect } from 'react';

// imports third party library
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';

interface ExtendedSession extends Session {
  error?: string;
}

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data } = useSession() as { data: ExtendedSession | null };

  useEffect(() => {
    if (data?.error === 'RefreshAccessTokenError') signIn('keycloak');
  }, [data]);

  return <>{children}</>;
}
