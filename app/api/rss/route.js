import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'RSS URL is required' }, { status: 400 });
  }

  try {
    // 使用 RSS2JSON API 作為代理服務
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'Failed to fetch RSS feed');
    }

    // 轉換格式以符合前端期望
    const items = data.items.map((item, index) => ({
      id: index + 1,
      title: item.title || 'No title',
      description: item.description ? item.description.replace(/<[^>]*>/g, '').trim() : '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      author: item.author || data.feed?.title || 'Unknown',
      category: item.categories?.join(', ') || 'General',
      source: 'EM'
    }));

    return NextResponse.json({ 
      items,
      feedInfo: {
        title: data.feed?.title || 'RSS Feed',
        description: data.feed?.description || '',
        link: data.feed?.link || ''
      }
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch RSS feed',
      details: error.message 
    }, { status: 500 });
  }
}
