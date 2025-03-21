"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Tag, Calendar, Eye, Clock } from "lucide-react";
import TitleBar from "@/components/layout/TitleBar";

// Mock data - Replace with your API fetch
const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: "使用 React 和 Next.js 建立個人網站",
    description:
      "這篇文章分享了如何使用 React 和 Next.js 框架來建立現代化的個人網站，包含了響應式設計和深色模式。",
    coverImage: "https://placehold.co/600x400/1a1a1a/ffffff/png?text=React+%26+Next.js",
    date: "2025-03-15",
    readingTime: "5 min",
    views: 256,
    tags: ["React", "Next.js", "Web Development"],
  },
  {
    id: 2,
    title: "UI/UX 設計的基本原則",
    description:
      "探討現代 UI/UX 設計的關鍵原則，以及如何在你的項目中應用這些原則來提升用戶體驗。",
    coverImage: "https://placehold.co/600x400/1a1a1a/ffffff/png?text=UI%2FUX+Design",
    date: "2025-03-01",
    readingTime: "8 min",
    views: 189,
    tags: ["Design", "UI/UX", "Creative"],
  },
  {
    id: 3,
    title: "JavaScript 的進階概念",
    description:
      "深入了解 JavaScript 的進階概念，如閉包、原型鏈、異步編程，幫助你提升你的前端開發技能。",
    coverImage: "https://placehold.co/600x400/1a1a1a/ffffff/png?text=JavaScript",
    date: "2025-02-20",
    readingTime: "10 min",
    views: 342,
    tags: ["JavaScript", "Frontend", "Programming"],
  },
];

export default function BlogListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setBlogPosts(MOCK_BLOG_POSTS);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(blogPosts.flatMap((post) => post.tags))].sort();

  return (
    <div className="px-4 py-8">
      {/* Search bar */}
      {/* <div className="sticky top-16 py-4 z-10">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <input
            type="text"
            placeholder="搜尋文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-700 text-zinc-300"
          />
        </div>
      </div> */}

      {/* Blog post list */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-300"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-zinc-400">沒有找到符合條件的文章</p>
        </div>
      ) : (
        <div className="space-y-6 mt-2 md:mt-6">
          {filteredPosts.map((post) => (
            <Link
              href={`/blog/${post.title.toLowerCase().replace(/\\s+/g, "-")}`}
              key={post.id}
              className="block"
            >
              <article className="border-b border-zinc-800 pb-6 last:border-0">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url("${post.coverImage || 'https://placehold.co/600x400@2x.png'}")` }}
                  />
                </div>

                <h2 className="text-xl font-semibold text-zinc-100 mb-2 hover:text-zinc-300 transition-colors">
                  {post.title}
                </h2>

                <p className="text-zinc-400 text-sm mb-4">{post.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full flex items-center hover:bg-zinc-700 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                      }}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {post.views} 次閱讀
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {post.readingTime}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
