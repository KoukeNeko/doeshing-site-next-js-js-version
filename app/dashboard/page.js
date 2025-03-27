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
    <div className="space-y-6 pt-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">歡迎回來，{session?.user?.name}！</h1>
        <p className="text-zinc-400">這裡是您的個人儀表板，您可以管理您的文章和設定。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-zinc-900/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">快速統計</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">我的文章</span>
              <span className="text-lg font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">草稿</span>
              <span className="text-lg font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">已發布</span>
              <span className="text-lg font-medium">0</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">最近活動</h2>
          <div className="space-y-2">
            <p className="text-zinc-400 text-sm">暫無活動記錄</p>
          </div>
        </div>

        {session?.user?.isAdmin && (
          <>
            <div className="p-6 bg-zinc-900/50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">網站統計</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">總文章數</span>
                  <span className="text-lg font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">總用戶數</span>
                  <span className="text-lg font-medium">0</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">系統狀態</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">系統運行狀態</span>
                  <span className="text-emerald-400">正常</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">最後更新</span>
                  <span className="text-zinc-300">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}