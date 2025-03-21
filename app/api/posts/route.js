import { NextResponse } from 'next/server';

// GET /api/posts - 獲取所有文章
export async function GET() {
  try {
    // TODO: 從數據庫獲取文章列表
    const posts = [
      {
        id: 1,
        title: "歡迎來到我的部落格",
        excerpt: "這是一個使用 Next.js 建立的部落格...",
        date: "2024-03-21",
        slug: "welcome-to-my-blog"
      }
    ];

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - 創建新文章
export async function POST(request) {
  try {
    const body = await request.json();
    
    // TODO: 驗證請求數據
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // TODO: 將文章保存到數據庫
    const post = {
      id: Date.now(),
      title: body.title,
      content: body.content,
      date: new Date().toISOString(),
      slug: body.title.toLowerCase().replace(/\s+/g, '-')
    };

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}