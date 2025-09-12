import { NextResponse } from 'next/server';

// 清除 HackMD 相關的 HTML 註解的函數
function cleanHackMDComments(content) {
  if (!content || typeof content !== 'string') return content || '';
  
  try {
    // 移除各種 HackMD 相關的 HTML 註解和內容
    return content
      // 移除 {%hackmd ...%} 格式的註解
      .replace(/<!--\s*{%hackmd[^%]*%}\s*-->/gi, '')
      // 移除包含特定文字的註解（如地球橢球相關）
      .replace(/<!--[^>]*為地球橢球[^>]*-->/gi, '')
      // 移除 dark theme 註解
      .replace(/<!--\s*dark\s*theme\s*-->/gi, '')
      // 移除其他可能的 HackMD 格式註解
      .replace(/<!--\s*a\s*為[^>]*-->/gi, '')
      // 移除 tags 行，格式如: ###### tags: `tag1` `tag2` `tag3`
      .replace(/^#{1,6}\s*tags:\s*(`[^`]*`\s*)*$/gmi, '')
      // 移除空行（由移除註解後可能產生的多餘空行）
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  } catch (error) {
    console.error('Error cleaning HackMD comments:', error);
    return content;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get('noteId');
  
  if (!noteId) {
    return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
  }

  try {
    const apiToken = process.env.HACKMD_API_TOKEN;
    const apiBaseUrl = process.env.HACKMD_API_BASE_URL || 'https://api.hackmd.io/v1';
    const username = process.env.HACKMD_USERNAME || 'KoukeNeko';
    
    let response;
    let content;
    let noteData = {};
    
    // 優先使用 HackMD API (需要 token)
    if (apiToken) {
      try {
        // 先嘗試使用 API 獲取筆記詳細資訊
        const apiResponse = await fetch(`${apiBaseUrl}/notes/${noteId}`, {
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (apiResponse.ok) {
          noteData = await apiResponse.json();
          content = noteData.content || '';
        } else if (apiResponse.status === 404) {
          // 如果筆記不存在，嘗試用 @username/noteId 格式
          const userNoteResponse = await fetch(`${apiBaseUrl}/notes/@${username}/${noteId}`, {
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (userNoteResponse.ok) {
            noteData = await userNoteResponse.json();
            content = noteData.content || '';
          } else {
            throw new Error(`API request failed: ${apiResponse.status}`);
          }
        } else {
          throw new Error(`API request failed: ${apiResponse.status}`);
        }
      } catch (apiError) {
        console.warn('HackMD API failed, falling back to download endpoint:', apiError.message);
        // 如果 API 失敗，退回到 download endpoint
        response = await fetch(`https://hackmd.io/${noteId}/download`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; HackMD Reader)',
            'Accept': 'text/markdown,text/plain,*/*',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Download fallback failed: ${response.status}`);
        }
        content = await response.text();
      }
    } else {
      // 沒有 token 時直接使用 download endpoint
      response = await fetch(`https://hackmd.io/${noteId}/download`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; HackMD Reader)',
          'Accept': 'text/markdown,text/plain,*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      content = await response.text();
    }

    
    // 清除 HackMD 相關的 HTML 註解
    content = cleanHackMDComments(content);
    
    // 解析 markdown 內容，提取標題和基本資訊
    const lines = content.split('\n');
    let title = 'Untitled';
    let description = '';
    
    // 尋找第一個 H1 標題
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim();
        break;
      }
    }
    
    // 獲取前幾行作為描述（排除標題行）
    const contentLines = lines.filter(line => 
      !line.startsWith('#') && 
      line.trim().length > 0 && 
      !line.startsWith('---')
    ).slice(0, 3);
    description = contentLines.join(' ').substring(0, 200);

    return NextResponse.json({
      id: noteId,
      title: noteData.title || title,
      content,
      description: noteData.description || description,
      url: `https://hackmd.io/${noteId}`,
      lastModified: noteData.updatedAt || noteData.lastChangedAt || new Date().toISOString(),
      type: 'hackmd',
      tags: noteData.tags || [],
      publishType: noteData.publishType || 'note',
      // 如果有 API 資料，包含更多元資訊
      ...(Object.keys(noteData).length > 0 && {
        apiData: {
          createdAt: noteData.createdAt,
          updatedAt: noteData.updatedAt,
          permalink: noteData.permalink,
          shortId: noteData.shortId,
          publishedAt: noteData.publishedAt
        }
      })
    });
  } catch (error) {
    console.error('Error fetching HackMD note:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch HackMD note',
      details: error.message,
      suggestion: process.env.HACKMD_API_TOKEN ? 
        'Check if the note ID is correct and accessible with your API token' : 
        'Consider setting HACKMD_API_TOKEN environment variable for better API access'
    }, { status: 500 });
  }
}