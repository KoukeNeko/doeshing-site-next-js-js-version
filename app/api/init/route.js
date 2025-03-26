import { NextResponse } from 'next/server';
import { initializeDatabase, checkTables } from '@/lib/db';

export async function GET() {
  try {
    // 先檢查資料表是否存在
    const tableStatus = await checkTables();
    
    // 如果有任何資料表不存在，執行初始化
    if (Object.values(tableStatus).includes(false)) {
      await initializeDatabase();
      return NextResponse.json({
        message: "Database initialized successfully",
        initialStatus: tableStatus,
        currentStatus: await checkTables()
      });
    }

    return NextResponse.json({
      message: "All tables already exist",
      status: tableStatus
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { error: "Failed to initialize database", details: error.message },
      { status: 500 }
    );
  }
} 