import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  const apiToken = process.env.HACKMD_API_TOKEN;
  const apiBaseUrl = process.env.HACKMD_API_BASE_URL || 'https://api.hackmd.io/v1';
  const defaultUsername = process.env.HACKMD_USERNAME || 'KoukeNeko';
  
  if (!apiToken) {
    return NextResponse.json({ 
      error: 'API token required',
      details: 'HACKMD_API_TOKEN environment variable is required to fetch user notes'
    }, { status: 400 });
  }

  try {
    const targetUsername = username || defaultUsername;
    
    // 記錄請求資訊（不包含 token）
    console.log('Fetching notes from:', `${apiBaseUrl}/notes`);
    console.log('Username:', targetUsername);
    
    // 取得使用者的所有筆記
    const response = await fetch(`${apiBaseUrl}/notes`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'HackMD-Blog-Integration/1.0',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const notes = await response.json();
    
    // 處理並格式化筆記列表
    const formattedNotes = notes.map(note => ({
      id: note.id,
      shortId: note.shortId,
      title: note.title || 'Untitled',
      description: note.description || '',
      tags: note.tags || [],
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      publishedAt: note.publishedAt,
      publishType: note.publishType,
      permalink: note.permalink,
      url: `https://hackmd.io/${note.shortId}`,
      editUrl: `https://hackmd.io/${note.shortId}/edit`,
      // 根據 publishType 決定是否公開
      isPublic: ['edit', 'view', 'both'].includes(note.publishType),
      // 建議的配置格式
      configSuggestion: {
        id: note.shortId,
        title: note.title || 'Untitled',
        description: note.description || '',
        category: "未分類", // 需要手動設定
        tags: note.tags || [],
        featured: false
      }
    }));

    // 按更新時間排序
    formattedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return NextResponse.json({
      username: targetUsername,
      totalNotes: formattedNotes.length,
      publicNotes: formattedNotes.filter(note => note.isPublic).length,
      notes: formattedNotes,
      // 提供建議的配置陣列
      suggestedConfig: formattedNotes.filter(note => note.isPublic).map(note => note.configSuggestion)
    });
  } catch (error) {
    console.error('Error fetching user notes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user notes',
      details: error.message
    }, { status: 500 });
  }
}