"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyPostsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, public, draft, pending
  
  // 分頁狀態
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // 保護頁面，確保用戶已登入
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 獲取用戶文章
  const fetchUserPosts = async (page = 1, status = null) => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const statusParam = status && status !== 'all' ? `&status=${status}` : '';
      const response = await fetch(`/api/posts/?page=${page}&limit=10${statusParam}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('無法載入您的文章，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  // 當用戶登入狀態或過濾器改變時重新獲取數據
  useEffect(() => {
    if (session?.user?.id) {
      const statusValue = filter === 'all' ? null : filter;
      fetchUserPosts(pagination.page, statusValue);
    }
  }, [session, filter, pagination.page]);

  // 處理頁面變更
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const statusValue = filter === 'all' ? null : filter;
      fetchUserPosts(newPage, statusValue);
    }
  };

  // 處理文章狀態過濾
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 })); // 重置到第一頁
  };

  // 處理刪除文章
  const handleDeletePost = async (postId) => {
    if (!confirm('確定要刪除這篇文章嗎？此操作無法撤銷。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('刪除文章失敗');
      }
      
      // 從列表中移除已刪除的文章
      setPosts(posts.filter(post => post.id !== postId));
      
      // 如果當前頁面沒有文章了，且不是第一頁，就返回上一頁
      if (posts.length === 1 && pagination.page > 1) {
        handlePageChange(pagination.page - 1);
      } else {
        // 否則重新獲取當前頁
        const statusValue = filter === 'all' ? null : filter;
        fetchUserPosts(pagination.page, statusValue);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('刪除文章失敗，請稍後再試。');
    }
  };
  
  // 載入中狀態
  if (status === 'loading' || (isLoading && !posts.length)) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 如果用戶未登入，不顯示任何內容（已有重定向邏輯）
  if (status === 'unauthenticated') {
    return null;
  }

  // 文章狀態標籤
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      public: "bg-emerald-900/50 text-emerald-300",
      draft: "bg-zinc-800 text-zinc-300",
      pending: "bg-amber-900/50 text-amber-300"
    };
    
    const statusLabels = {
      public: "已發布",
      draft: "草稿",
      pending: "審核中"
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${statusClasses[status] || "bg-zinc-800 text-zinc-300"}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 頁面頭部 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">我的文章</h1>
        <Link 
          href="/dashboard/posts/new" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
        >
          <Plus size={16} />
          新增文章
        </Link>
      </div>
      
      {/* 過濾器 */}
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        <span className="text-zinc-400 flex items-center gap-1">
          <Filter size={16} />
          狀態:
        </span>
        <button 
          onClick={() => handleFilterChange('all')}
          className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
        >
          全部
        </button>
        <button 
          onClick={() => handleFilterChange('public')}
          className={`px-3 py-1 text-sm rounded-full ${filter === 'public' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
        >
          已發布
        </button>
        <button 
          onClick={() => handleFilterChange('draft')}
          className={`px-3 py-1 text-sm rounded-full ${filter === 'draft' ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
        >
          草稿
        </button>
        <button 
          onClick={() => handleFilterChange('pending')}
          className={`px-3 py-1 text-sm rounded-full ${filter === 'pending' ? 'bg-amber-900/50 text-amber-300' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
        >
          審核中
        </button>
      </div>
      
      {/* 錯誤提示 */}
      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* 文章列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-lg">
          <p className="text-zinc-400 mb-4">您目前沒有{filter !== 'all' ? `狀態為 ${filter} 的` : ''}文章</p>
          <Link 
            href="/dashboard/posts/new" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
          >
            <Plus size={16} />
            新增文章
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-900">
              <tr>
                <th className="py-3 px-4 text-left text-zinc-400 font-medium">標題</th>
                <th className="py-3 px-4 text-left text-zinc-400 font-medium">狀態</th>
                <th className="py-3 px-4 text-left text-zinc-400 font-medium">瀏覽次數</th>
                <th className="py-3 px-4 text-left text-zinc-400 font-medium">發布日期</th>
                <th className="py-3 px-4 text-right text-zinc-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-zinc-900/50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-zinc-200">{post.title}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-xs">{post.summary || '無摘要'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{post.views}</td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/blog?id=${post.id}`} className="p-1 text-zinc-400 hover:text-zinc-200">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/dashboard/posts/edit/${post.id}`} className="p-1 text-zinc-400 hover:text-zinc-200">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDeletePost(post.id)} 
                        className="p-1 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 分頁控制 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-800">
          <div className="text-sm text-zinc-500">
            顯示 {posts.length} 篇文章，共 {pagination.total} 篇
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className={`p-2 rounded ${
                pagination.hasPrevPage
                  ? "text-zinc-300 hover:bg-zinc-800"
                  : "text-zinc-600 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center px-3 py-1 bg-zinc-900 rounded text-zinc-300">
              {pagination.page} / {pagination.totalPages}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className={`p-2 rounded ${
                pagination.hasNextPage
                  ? "text-zinc-300 hover:bg-zinc-800"
                  : "text-zinc-600 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 