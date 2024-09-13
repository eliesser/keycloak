'use client';

// imports react
import { useEffect } from 'react';

// imports third party library
import { signIn } from 'next-auth/react';

export default function Login() {
  useEffect(() => {
    signIn('keycloak');
  }, []);

  return <></>;
}
