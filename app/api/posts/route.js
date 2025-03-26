import { NextResponse } from 'next/server';
import { getAllPosts, getPostById, createPost, updatePost, deletePost, getPostsCount } from '@/lib/db';

/**
 * GET /api/posts - 獲取文章列表
 * 
 * Query Parameters:
 * @param {number} [page=1] - 頁碼，從1開始
 * @param {number} [limit=10] - 每頁顯示的文章數量，最大50
 * @param {string} [status='public'] - 文章狀態：public/draft/pending
 * 
 * Response 200:
 * {
 *   posts: [{
 *     id: string,
 *     title: string,
 *     content: string,
 *     summary: string,
 *     user_id: string,
 *     author_name: string,
 *     category_id: string,
 *     category_name: string,
 *     cover_image: string,
 *     status: string,
 *     views: number,
 *     created_at: string,
 *     updated_at: string
 *   }],
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
 * Error 400: Invalid pagination parameters
 * Error 500: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'public';

    // 驗證參數
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // 並行獲取文章列表和總數
    const [posts, total] = await Promise.all([
      getAllPosts({ page, limit, status }),
      getPostsCount(status)
    ]);

    // 計算總頁數
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
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts - 建立新文章
 * 
 * Request Body:
 * {
 *   user_id: string,      // 必填：作者ID
 *   title: string,        // 必填：文章標題
 *   content: string,      // 必填：文章內容
 *   summary?: string,     // 選填：文章摘要
 *   category_id?: string, // 選填：分類ID
 *   cover_image?: string, // 選填：封面圖片URL
 *   status?: string      // 選填：文章狀態(public/draft/pending)，預設draft
 * }
 * 
 * Response 201:
 * {
 *   id: string,
 *   title: string,
 *   ...其他文章欄位
 * }
 * 
 * Error 400: Missing required fields
 * Error 500: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.content || !body.user_id) {
      return NextResponse.json(
        { error: "Title, content and user_id are required" },
        { status: 400 }
      );
    }

    const post = await createPost({
      user_id: body.user_id,
      title: body.title,
      content: body.content,
      summary: body.summary,
      category_id: body.category_id,
      cover_image: body.cover_image,
      status: body.status || 'draft'
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/:id - 更新文章
 * 
 * URL Parameters:
 * @param {string} id - 文章ID
 * 
 * Request Body:
 * {
 *   title?: string,       // 選填：文章標題
 *   content?: string,     // 選填：文章內容
 *   summary?: string,     // 選填：文章摘要
 *   category_id?: string, // 選填：分類ID
 *   cover_image?: string, // 選填：封面圖片URL
 *   status?: string      // 選填：文章狀態(public/draft/pending)
 * }
 * 
 * Response 200:
 * {
 *   id: string,
 *   title: string,
 *   ...更新後的文章欄位
 * }
 * 
 * Error 400: Missing post ID
 * Error 500: Server error
 */
export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await updatePost(id, {
      title: body.title,
      content: body.content,
      summary: body.summary,
      category_id: body.category_id,
      cover_image: body.cover_image,
      status: body.status
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/:id - 刪除文章
 * 
 * URL Parameters:
 * @param {string} id - 文章ID
 * 
 * Response 200:
 * {
 *   message: "Post deleted successfully"
 * }
 * 
 * Error 400: Missing post ID
 * Error 500: Server error
 * 
 * 注意：刪除文章會同時刪除相關的標籤關聯和評論
 */
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    await deletePost(id);
    
    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
