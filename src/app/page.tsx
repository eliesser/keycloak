// imports nextjs
import { redirect } from 'next/navigation';

// imports third party library
import { getServerSession } from 'next-auth';

// imports project
import { authOptions } from './api/auth/[...nextauth]/route';
import Login from '../components/Login';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect('/private');

  return <Login />;
}
