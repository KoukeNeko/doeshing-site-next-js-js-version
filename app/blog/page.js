"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Tag, Calendar, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import TitleBar from "@/components/layout/TitleBar";
import { useSearchParams } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import 'katex/dist/katex.css';

export default function BlogListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const searchParams = useSearchParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  // 獲取文章列表
  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=10&status=public`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setBlogPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    fetchPosts();
  }, []);

  // 處理分頁切換
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage);
    }
  };

  // 過濾文章
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.summary || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? (post.tags || []).includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(blogPosts.flatMap((post) => post.tags || []))].sort();

  // 分頁控制元件
  const PaginationControls = () => (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={!pagination.hasPrevPage}
        className={`flex items-center px-3 py-2 rounded-lg ${
          pagination.hasPrevPage
            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            : "bg-zinc-900 text-zinc-500 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={20} className="mr-1" />
        上一頁
      </button>
      
      <span className="text-zinc-400">
        第 {pagination.page} / {pagination.totalPages} 頁
      </span>
      
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={!pagination.hasNextPage}
        className={`flex items-center px-3 py-2 rounded-lg ${
          pagination.hasNextPage
            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            : "bg-zinc-900 text-zinc-500 cursor-not-allowed"
        }`}
      >
        下一頁
        <ChevronRight size={20} className="ml-1" />
      </button>
    </div>
  );

  useEffect(() => {
    const fetchPost = async () => {
      const id = searchParams.get('id');
      if (!id) {
        setError('文章 ID 不能為空');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/id?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('無法載入文章，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        <div className="bg-zinc-900/30 text-zinc-300 p-4 rounded-lg">
          找不到文章
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Blog post list */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px] mt-6 md:mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-300"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-zinc-400">沒有找到符合條件的文章</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mt-6 md:mt-8">
            {filteredPosts.map((post) => (
              <Link
                href={`/blog/post?id=${post.id}`}
                key={post.id}
                className="block"
              >
                <article className="border-b border-zinc-800 pb-6 last:border-0">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <div
                      className="w-full h-full bg-center bg-cover"
                      style={{ backgroundImage: `url("${post.cover_image || 'https://placehold.co/600x400@2x.png'}")` }}
                    />
                  </div>

                  <h2 className="text-xl font-semibold text-zinc-100 mb-2 hover:text-zinc-300 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-zinc-400 text-sm mb-4">{post.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(post.tags || []).map((tag) => (
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
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {post.views} 次閱讀
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {Math.ceil(post.content.length / 500)} min
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          <PaginationControls />
        </>
      )}
    </div>
  );
}
