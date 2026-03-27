import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";
import type { AdapterUser } from "@auth/core/adapters";

/**
 * Shared session/JWT callbacks — no Prisma (safe for Edge when merged).
 * Full NextAuth config with providers + adapter lives in `auth.ts`.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User | AdapterUser;
      trigger?: "signIn" | "signUp" | "update";
      session?: { name?: string | null };
    }) {
      if (user) {
        token.sub = user.id as string;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role =
          (user as { role?: "INVESTOR" | "EMPLOYEE" }).role ?? "INVESTOR";
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: import("next-auth").Session;
      token: JWT;
    }) {
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
};
