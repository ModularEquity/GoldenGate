"use client";

import { SessionProvider } from "next-auth/react";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ChatbotWidget />
    </SessionProvider>
  );
}
