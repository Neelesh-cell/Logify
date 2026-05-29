import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        // @ts-ignore
        token.accessToken = account.access_token;
        // @ts-ignore
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
