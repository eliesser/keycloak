'use client';

// imports project
import federatedLogout from '@/utils/federatedLogout';

export default function Logout() {
  return <button onClick={() => federatedLogout()}>Signout of keycloak</button>;
}
