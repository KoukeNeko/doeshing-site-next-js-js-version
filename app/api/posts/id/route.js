import { NextResponse } from 'next/server';
import { getPostById, incrementPostViews } from '@/lib/db';

/**
 * GET /api/posts/id - 獲取單篇文章
 * 
 * Query Parameters:
 * @param {string} id - 文章ID
 * 
 * Response 200:
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   summary: string,
 *   user_id: string,
 *   author_name: string,
 *   category_id: string,
 *   category_name: string,
 *   cover_image: string,
 *   status: string,
 *   views: number,
 *   created_at: string,
 *   updated_at: string
 * }
 * 
 * Error 400: Missing post ID
 * Error 404: Post not found
 * Error 500: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // 增加瀏覽次數
    await incrementPostViews(id);

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
} 