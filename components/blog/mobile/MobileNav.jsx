"use client";

import { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft, HashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '../layout/Sidebar';
import Link from 'next/link';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // 當選單打開時禁止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* 選單按鈕 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-20 left-4 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </Button>

      {/* 遮罩層 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 側邊選單 */}
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-black/50 backdrop-blur-sm  border-r border-zinc-800 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft size={24} />
          </Button>
          <h2 className="text-lg font-semibold">部落格選單</h2>
          <div className="w-8" /> {/* 為了對稱的空白區域 */}
        </div>
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          <Sidebar />
          
          {/* 熱門主題 */}
          <div className="p-4 border-t border-zinc-800 mt-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center">
              <HashIcon size={16} className="mr-2" />
              熱門主題
            </h3>
            <div className="space-y-2">
              {['React', 'JavaScript', 'NextJS', 'TailwindCSS', 'Web開發'].map((tag) => (
                <Link 
                  key={tag} 
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-sm text-zinc-500 hover:text-zinc-300 py-1"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}