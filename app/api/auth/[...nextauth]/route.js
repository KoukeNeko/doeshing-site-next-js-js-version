import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Add admin flag to the token
      if (token.email === process.env.ADMIN_EMAIL) {
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      // Add admin flag to the session
      session.user.isAdmin = token.email === process.env.ADMIN_EMAIL;
      
      // Debug log
      console.log('Session user:', {
        email: session.user.email,
        isAdmin: session.user.isAdmin,
        adminEmail: process.env.ADMIN_EMAIL
      });
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign in
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      // Allows relative callback URLs
      else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return url;
    },
  },
});

export { handler as GET, handler as POST }; 