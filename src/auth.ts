import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { roleFromEmail } from "@/lib/roles";

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID?.trim()) &&
  Boolean(process.env.AUTH_GOOGLE_SECRET?.trim());

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailRaw =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";
        if (!emailRaw || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: emailRaw },
        });
        if (!user?.passwordHash) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, email: true, name: true, image: true },
        });
        token.sub = user.id;
        token.email = dbUser?.email ?? user.email;
        token.name = dbUser?.name ?? user.name;
        token.picture = dbUser?.image ?? user.image;
        token.role = dbUser?.role ?? (user as { role?: string }).role ?? "INVESTOR";
      } else if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { role: true, email: true, name: true, image: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = (token.email as string) ?? "";
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
        session.user.role =
          (token.role as "INVESTOR" | "EMPLOYEE") ?? "INVESTOR";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  events: {
    async createUser({ user }) {
      const role = roleFromEmail(user.email);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role,
          emailVerified: user.email ? new Date() : undefined,
        },
      });
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id) {
        const role = roleFromEmail(user.email);
        await prisma.user.update({
          where: { id: user.id },
          data: { role },
        });
      }
    },
    async linkAccount({ user }) {
      const u = await prisma.user.findUnique({ where: { id: user.id } });
      if (!u) return;
      const role = roleFromEmail(u.email);
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    },
  },
});
