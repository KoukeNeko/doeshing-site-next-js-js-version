"use client";

import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">儀表板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/dashboard/posts"
          className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">文章管理</h2>
          <p className="text-zinc-400">管理您的部落格文章</p>
        </Link>
        
        <Link 
          href="/dashboard/settings"
          className="p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">網站設定</h2>
          <p className="text-zinc-400">管理網站的基本設定</p>
        </Link>
      </div>
    </div>
  );
}