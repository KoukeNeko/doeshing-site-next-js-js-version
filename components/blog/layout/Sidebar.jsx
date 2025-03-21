"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Hash,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  PenSquare
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: '首頁',
      href: '/blog',
      icon: Home
    },
    {
      name: '探索',
      href: '/blog/explore',
      icon: Hash
    },
    {
      name: '通知',
      href: '/blog/notifications',
      icon: Bell
    },
    {
      name: '私訊',
      href: '/blog/messages',
      icon: Mail
    },
    {
      name: '書籤',
      href: '/blog/bookmarks',
      icon: Bookmark
    },
    {
      name: '個人檔案',
      href: '/blog/profile',
      icon: User
    },
    {
      name: '設定',
      href: '/blog/settings',
      icon: Settings
    }
  ];

  return (
    <div className="flex flex-col h-full px-2">
      {/* Logo */}
      <Link 
        href="/blog" 
        className="p-3 mb-1 rounded-full hover:bg-zinc-900 w-fit"
      >
        <span className="text-xl">🌐</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-xl rounded-full transition-colors hover:bg-zinc-900 ${
                isActive ? 'font-bold' : ''
              }`}
            >
              <item.icon size={24} className="mr-4" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Post Button */}
      <button className="mt-4 w-[90%] bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 font-bold transition-colors">
        發表文章
      </button>

      {/* Profile Button */}
      <div className="mt-auto mb-4">
        <button className="w-full rounded-full p-3 hover:bg-zinc-900 flex items-center">
          <div className="w-10 h-10 bg-zinc-800 rounded-full mr-3"></div>
          <div className="flex-grow text-left">
            <div className="font-bold">陳德生</div>
            <div className="text-zinc-500 text-sm">@doeshing</div>
          </div>
          <div className="text-zinc-500">•••</div>
        </button>
      </div>
    </div>
  );
}