"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

function DashboardSidebar({ session }) {
  const menuItems = [
    {
      title: "我的文章",
      href: "/dashboard/posts",
      icon: "📝",
      description: "管理您的部落格文章",
    },
    ...(session?.user?.isAdmin ? [
      {
        title: "用戶管理",
        href: "/dashboard/users",
        icon: "👥",
        description: "管理網站用戶權限",
      },
      {
        title: "網站設定",
        href: "/dashboard/settings",
        icon: "⚙️",
        description: "管理網站的基本設定",
      },
      {
        title: "所有文章",
        href: "/dashboard/posts/all",
        icon: "📚",
        description: "管理所有用戶的文章",
      },
    ] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">功能選單</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col w-full p-3 hover:bg-zinc-900/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span role="img" aria-label={item.title}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.title}</span>
              </div>
              <span className="text-sm text-zinc-400 mt-1">{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserCard({ session }) {
  const router = useRouter();
  
  return (
    <div className="p-4">
      <div className="p-6 bg-zinc-900/50 rounded-lg">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-12 h-12 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{session.user?.name || 'User'}</h2>
            <p className="text-sm text-zinc-400 truncate">{session.user?.email}</p>
            {session.user?.isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-md">
                管理員
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => {
            console.log('Logging out...');
            router.push('/api/auth/signout');
          }}
          className="mt-4 w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm transition-colors"
        >
          登出
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto relative min-h-[calc(100vh-theme(spacing.16))] flex flex-col">
      <div className="flex justify-center gap-6 pt-4 md:pt-8 px-4 md:px-6 mt-0 md:mt-0 flex-1">
        {/* Left Sidebar */}
        <div className="w-[220px] xl:w-[240px] hidden md:block shrink-0">
          <div className="sticky top-20 space-y-4">
            <UserCard session={session} />
            <DashboardSidebar session={session} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full md:max-w-[600px] xl:max-w-[600px] md:border-x border-zinc-800">
          <div className="px-2 md:px-6 pt-8">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-[280px] hidden xl:block shrink-0">
          <div className="sticky top-20">
            {/* Debug Info in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-zinc-900/30 rounded-lg space-y-2">
                <h3 className="text-sm font-medium">Debug Info</h3>
                <p className="text-xs text-zinc-500">Status: {status}</p>
                <p className="text-xs text-zinc-500">Is Admin: {String(session.user?.isAdmin)}</p>
                <p className="text-xs text-zinc-500">Email: {session.user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 