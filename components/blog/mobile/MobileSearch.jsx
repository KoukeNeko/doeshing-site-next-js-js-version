"use client";

import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function MobileSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="md:hidden sticky top-16 z-40 bg-zinc-950/20 backdrop-blur-sm py-2 px-4 border-b border-zinc-800/50">
      {isSearchOpen ? (
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋文章..."
            className="w-full bg-zinc-900 rounded-full py-2 pl-10 pr-10 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            onClick={() => setIsSearchOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">部落格</h1>
          <button 
            className="p-2 rounded-full hover:bg-zinc-800/50"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={20} />
          </button>
        </div>
      )}
    </div>
  );
}