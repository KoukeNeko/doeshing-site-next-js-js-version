import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserById } from '@/lib/db';

// GET /api/auth/user - 獲取當前登入用戶資訊
export async function GET(req) {
  try {
    // 獲取伺服器端 session
    const session = await getServerSession();
    
    // 如果沒有 session 或沒有用戶，返回未登入狀態
    if (!session || !session.user) {
      return NextResponse.json({ 
        authenticated: false,
        message: "User not authenticated" 
      }, { status: 401 });
    }
    
    // 獲取用戶完整資料
    const user = await getUserById(session.user.id);
    
    // 如果用戶不存在於資料庫，返回錯誤
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: "User not found in database" 
      }, { status: 404 });
    }
    
    // 過濾敏感資訊
    const { password, ...userInfo } = user;
    
    // 返回用戶資訊
    return NextResponse.json({ 
      authenticated: true,
      user: {
        ...userInfo,
        ...session.user,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ 
      authenticated: false,
      message: "Error fetching user information" 
    }, { status: 500 });
  }
} 