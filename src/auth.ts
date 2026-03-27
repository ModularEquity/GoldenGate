import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";
import { roleFromEmail } from "@/lib/roles";
import { getAuthSecret } from "@/lib/auth-secret";
import { generateReferralCode } from "@/lib/referral-code";

/**
 * OAuth redirect_uri must match Google Console exactly. On custom domains,
 * VERCEL_URL is often still *.vercel.app — set AUTH_URL or APP_URL to
 * https://modularequity.com (see docs/google-oauth.md).
 */
function ensureAuthUrl() {
  if (process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim()) return;

  const candidates = [
    process.env.APP_URL?.trim(),
    process.env.NEXT_PUBLIC_APP_URL?.trim(),
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim(),
    process.env.VERCEL_URL?.trim(),
  ].filter(Boolean) as string[];

  const pick = candidates[0];
  if (pick) {
    process.env.AUTH_URL = pick.startsWith("http") ? pick : `https://${pick}`;
  }
}
ensureAuthUrl();

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID?.trim()) &&
  Boolean(process.env.AUTH_GOOGLE_SECRET?.trim());

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getAuthSecret(),
  debug: process.env.NODE_ENV !== "production",
  adapter: PrismaAdapter(prisma),
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

        try {
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
        } catch (err) {
          console.error("[auth] Credentials authorize failed:", err);
          return null;
        }
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      const role = roleFromEmail(user.email);
      let referralCode = generateReferralCode();
      for (let i = 0; i < 10; i++) {
        const clash = await prisma.user.findUnique({
          where: { referralCode },
        });
        if (!clash) break;
        referralCode = generateReferralCode();
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role,
          emailVerified: user.email ? new Date() : undefined,
          referralCode,
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
