"use client";

import React from 'react';
import { Search } from 'lucide-react';

export default function RightSidebar() {
  const trendingTopics = [
    { tag: 'React', posts: '2,543 posts' },
    { tag: 'JavaScript', posts: '1,234 posts' },
    { tag: 'NextJS', posts: '987 posts' },
    { tag: 'TailwindCSS', posts: '654 posts' },
  ];

  const suggestedUsers = [
    { name: 'React News', handle: '@reactjs', avatar: '⚛️' },
    { name: 'Next.js', handle: '@nextjs', avatar: '▲' },
    { name: 'Tailwind CSS', handle: '@tailwindcss', avatar: '🎨' },
  ];

  return (
    <div className="h-full px-6 py-2 space-y-4">
      {/* Search Bar */}
      <div className="sticky top-0 pt-2 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋"
            className="w-full bg-zinc-900 rounded-full py-2 pl-12 pr-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-bold px-4 py-3 border-b border-zinc-800">熱門主題</h2>
        <div className="divide-y divide-zinc-800">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer">
              <div className="text-sm text-zinc-500">#{topic.tag}</div>
              <div className="text-sm text-zinc-400">{topic.posts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-bold px-4 py-3 border-b border-zinc-800">推薦關注</h2>
        <div className="divide-y divide-zinc-800">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mr-3">
                  {user.avatar}
                </div>
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-sm text-zinc-500">{user.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-4 text-sm text-zinc-500">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">服務條款</a>
          <a href="#" className="hover:underline">隱私政策</a>
          <a href="#" className="hover:underline">Cookie 政策</a>
          <a href="#" className="hover:underline">關於</a>
          <span>© 2024 Doeshing</span>
        </div>
      </div>
    </div>
  );
}