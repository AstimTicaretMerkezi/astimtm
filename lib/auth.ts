import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUsers } from "./github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { users } = await getUsers();
        const user = users.find((u) => u.email === credentials.email);
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          atolyeId: user.atolyeId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.atolyeId = (user as any).atolyeId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      session.user.atolyeId = token.atolyeId as string | null;
      return session;
    },
  },
  pages: {
    signIn: "/giris",
  },
  session: { strategy: "jwt" },
});
