import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, createUser, updateUserLastLogin, updateUserRole } from '@/lib/db';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) {
        return false;
      }

      try {
        // 檢查是否為管理員郵箱
        const isAdmin = user.email === process.env.ADMIN_EMAIL;
        console.log(`Admin check: ${user.email} === ${process.env.ADMIN_EMAIL}, isAdmin: ${isAdmin}`);
        
        // 嘗試從資料庫獲取用戶
        let dbUser = await getUserByEmail(user.email);
        
        // 如果用戶不存在，則創建新用戶
        if (!dbUser) {
          console.log(`User ${user.email} not found, creating new user...`);
          
          dbUser = await createUser({
            id: user.id || profile.sub,
            name: user.name,
            email: user.email,
            image: user.image,
            role: isAdmin ? 'admin' : 'reader', // 如果郵箱匹配則設為管理員
          });
          
          console.log(`New user created:`, dbUser);
        } else {
          // 更新登入時間
          await updateUserLastLogin(dbUser.id);
          
          // 檢查現有用戶是否需要更新為管理員
          if (isAdmin && dbUser.role !== 'admin') {
            await updateUserRole(dbUser.id, 'admin');
            console.log(`User ${user.email} role updated to admin`);
          }
          
          console.log(`User ${user.email} logged in successfully`);
        }
        
        // 將用戶角色存入 OAuth 用戶對象，供後續使用
        user.role = dbUser.role;
        
        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // 首次登入時，將用戶資料添加到令牌
      if (account && user) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isAdmin = token.role === 'admin';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback called with url:', url);
      
      // 如果是登入完成的回調，導向至儀表板
      if (url.includes('/api/auth/callback/')) {
        return `${baseUrl}/dashboard`;
      }
      
      // 如果是其他頁面內的重定向，保持原樣
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      return url;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 