/**
 * HomePage Component
 * 
 * This is the main landing page component that serves as the entry point for authenticated users.
 * It handles server-side authentication verification and redirects unauthenticated users to the login page.
 * 
 * @returns {JSX.Element} The home page with the calendar component for authenticated users
 */

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Calendar from './components/Calendar';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get?.('token');
  const token = tokenCookie?.value;

  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <Calendar />
      </div>
    </div>
  );
}
