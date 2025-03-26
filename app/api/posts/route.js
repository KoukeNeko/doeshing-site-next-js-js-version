import { NextResponse } from 'next/server';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '@/lib/db';

// GET /api/posts - 獲取所有文章
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - 建立新文章
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

// PUT /api/posts/:id - 更新文章
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

// DELETE /api/posts/:id - 刪除文章
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
