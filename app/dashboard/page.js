"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Debug logs
  useEffect(() => {
    console.log('Dashboard - Session status:', status);
    console.log('Dashboard - Session data:', session);
  }, [session, status]);

  // Protect the dashboard route
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, don't show anything while redirecting
  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Info Section */}
      <div className="mb-8 p-6 bg-zinc-900/50 rounded-lg">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{session.user?.name || 'User'}</h2>
            <p className="text-zinc-400">{session.user?.email}</p>
            {session.user?.isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 bg-amber-500/10 text-amber-500 text-sm rounded-md">
                管理員
              </span>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">儀表板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 所有用戶都可以看到的功能 */}
        <Link 
          href="/dashboard/posts"
          className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">我的文章</h2>
          <p className="text-zinc-400">管理您的部落格文章</p>
        </Link>
        
        {/* 只有管理員可以看到的功能 */}
        {session.user?.isAdmin && (
          <>
            <Link 
              href="/dashboard/users"
              className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">用戶管理</h2>
              <p className="text-zinc-400">管理網站用戶權限</p>
            </Link>

            <Link 
              href="/dashboard/settings"
              className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">網站設定</h2>
              <p className="text-zinc-400">管理網站的基本設定</p>
            </Link>

            <Link 
              href="/dashboard/posts/all"
              className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">所有文章</h2>
              <p className="text-zinc-400">管理所有用戶的文章</p>
            </Link>
          </>
        )}

        <button 
          onClick={() => {
            console.log('Logging out...');
            router.push('/api/auth/signout');
          }}
          className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors text-left"
        >
          <h2 className="text-xl font-semibold mb-2 text-red-400">登出</h2>
          <p className="text-zinc-400">登出您的帳號</p>
        </button>
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-zinc-900/30 rounded-lg">
        <p className="text-xs text-zinc-500">Status: {status}</p>
        <p className="text-xs text-zinc-500">Is Admin: {String(session.user?.isAdmin)}</p>
        <p className="text-xs text-zinc-500">Email: {session.user?.email}</p>
      </div>
    </div>
  );
}