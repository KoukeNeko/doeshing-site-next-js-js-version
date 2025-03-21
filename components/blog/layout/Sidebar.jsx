"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Code2,
  Laptop,
  GraduationCap,
  Coffee,
  Lightbulb,
  PenTool,
  Rocket,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const categories = [
    {
      name: '所有文章',
      href: '/blog',
      icon: Home,
      description: '瀏覽所有文章'
    },
    {
      name: '程式開發',
      href: '/blog/category/programming',
      icon: Code2,
      description: '軟體開發、程式語言、框架等',
      subcategories: ['React', 'Next.js', 'JavaScript', 'Python']
    },
    {
      name: '技術研究',
      href: '/blog/category/tech',
      icon: Laptop,
      description: '技術研究、新技術探索',
      subcategories: ['AI', '區塊鏈', '雲端運算']
    },
    {
      name: '學習筆記',
      href: '/blog/category/study',
      icon: GraduationCap,
      description: '課程筆記、學習心得',
      subcategories: ['資料結構', '演算法', '系統設計']
    },
    {
      name: '生活紀錄',
      href: '/blog/category/life',
      icon: Coffee,
      description: '日常生活、心得分享',
      subcategories: ['旅遊', '美食', '心得']
    },
    {
      name: '專案開發',
      href: '/blog/category/projects',
      icon: Rocket,
      description: '個人專案、作品分享',
      subcategories: ['作品集', '開源專案']
    },
    {
      name: '創意發想',
      href: '/blog/category/ideas',
      icon: Lightbulb,
      description: '想法分享、創意發想',
      subcategories: ['設計', 'UI/UX', '產品']
    }
  ];

  return (
    <div className="h-full px-2 py-4 overflow-y-auto">
      {/* Logo */}
      <Link 
        href="/blog" 
        className="flex items-center px-4 py-2 mb-4"
      >
        <span className="text-xl font-bold">部落格分類</span>
      </Link>

      {/* Categories */}
      <nav className="space-y-1">
        {categories.map((category) => {
          const isActive = pathname === category.href || pathname.startsWith(category.href + '/');
          return (
            <div key={category.href} className="mb-2">
              <Link
                href={category.href}
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors hover:bg-zinc-800/50 ${
                  isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
                }`}
              >
                <category.icon size={18} className="mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-zinc-500">{category.description}</div>
                </div>
              </Link>
              
              {/* Subcategories */}
              {category.subcategories && isActive && (
                <div className="ml-9 mt-1 space-y-1">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      href={`${category.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center px-4 py-1.5 text-sm text-zinc-400 rounded-lg hover:bg-zinc-800/50 hover:text-zinc-300"
                    >
                      <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full mr-3"></span>
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-6 px-4">
        <Link
          href="/blog/settings"
          className="flex items-center py-2 text-sm text-zinc-400 hover:text-zinc-300"
        >
          <Settings size={18} className="mr-3" />
          部落格設定
        </Link>
      </div>
    </div>
  );
}