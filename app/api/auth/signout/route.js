import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Clear any session cookies
  const cookieStore = cookies();
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.startsWith('next-auth')) {
      cookieStore.delete(cookie.name);
    }
  });

  // Redirect to the login page after signout
  return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
} 