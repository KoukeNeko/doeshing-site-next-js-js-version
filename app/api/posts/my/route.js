import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserPosts, getUserPostsCount } from '@/lib/db';

/**
 * GET /api/posts/my - 獲取當前用戶的文章列表
 * 
 * Query Parameters:
 * @param {number} [page=1] - 頁碼，從1開始
 * @param {number} [limit=10] - 每頁顯示的文章數量，最大50
 * @param {string} [status] - 文章狀態過濾器: public/draft/pending，不指定則獲取全部
 * 
 * Response 200:
 * {
 *   posts: [...],
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     total: number,
 *     totalPages: number,
 *     hasNextPage: boolean,
 *     hasPrevPage: boolean
 *   }
 * }
 * 
 * Error 401: Not authenticated
 * Error 500: Server error
 */
export async function GET(request) {
  try {
    // 獲取當前會話
    const session = await getServerSession();

    // 檢查用戶是否登入
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // 獲取查詢參數
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || null;

    // 驗證分頁參數
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // 並行獲取文章和總數
    const [posts, total] = await Promise.all([
      getUserPosts(userId, { page, limit, status }),
      getUserPostsCount(userId, status)
    ]);

    // 計算分頁資訊
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Failed to fetch user posts:', error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
} 