"use client";

import { useState } from "react";
import Link from "next/link";
import { getContactEmail } from "@/lib/site-contact";

type Msg = { role: "user" | "assistant"; text: string };

function routeReply(input: string): string {
  const q = input.toLowerCase().trim();

  if (/hello|hi\b|^hey/.test(q)) {
    return "Hi — I’m the Modular Equity assistant. Ask about deals, funding, accounts, or how to reach our team.";
  }
  if (/deal|invest|subscribe|umberland|flip/.test(q)) {
    return "Open Deal room from your dashboard to review opportunities and Subscribe for an amount (min $5k, per-deal cap). Each deal page has financials and an investment calculator.";
  }
  if (/bank|plaid|ach|fund|wire/.test(q)) {
    return "Link a bank on the Fund page (Plaid or manual reference). Funding intents are logged; live ACH may require additional setup.";
  }
  if (/login|password|google|auth|sign/.test(q)) {
    return "Use Login for email/password or Google. If OAuth fails, ensure AUTH_URL / NEXT_PUBLIC_APP_URL match your domain and Google redirect URIs.";
  }
  if (/contact|email|reach|human|speak|call/.test(q)) {
    return `For direct help, use the Contact page (${getContactEmail()} is listed there).`;
  }
  if (/tax|w-9|w8|tin/.test(q)) {
    return "Complete tax intake under Dashboard → Onboarding → Tax; you can download a summary PDF.";
  }
  if (/faq|help|what can/.test(q)) {
    return "See the FAQ in your dashboard, or try keywords: deals, funding, contact.";
  }
  return "I can point you to deals, funding, tax, or login — try “deals”, “bank link”, or “contact”. For specifics, email the team.";
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask about deals, funding, Plaid, or say **contact** for our email.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  function send() {
    const t = input.trim();
    if (!t || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: routeReply(t) }]);
      setBusy(false);
    }, 400);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full border-2 border-cyan-400/50 bg-slate-900 text-2xl text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.45)] transition hover:scale-105 hover:shadow-[0_0_36px_rgba(34,211,238,0.65)]"
        aria-expanded={open}
        aria-label="Open chat"
      >
        💬
      </button>

      {open ? (
        <div className="fixed bottom-24 right-5 z-50 flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/95 shadow-[0_0_40px_rgba(34,211,238,0.2)] backdrop-blur-md">
          <div className="border-b border-cyan-500/20 px-4 py-3">
            <p className="text-sm font-semibold text-cyan-200">Modular Equity</p>
            <p className="text-xs text-slate-400">Guided answers · not financial advice</p>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto px-3 py-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-6 rounded-lg bg-cyan-900/40 px-3 py-2 text-cyan-50"
                    : "mr-4 rounded-lg bg-slate-800/80 px-3 py-2 text-slate-200"
                }
              >
                {m.text}
              </div>
            ))}
            {busy ? (
              <p className="text-xs text-slate-500">…</p>
            ) : null}
          </div>
          <div className="flex gap-2 border-t border-cyan-500/20 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a question…"
              className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            >
              Send
            </button>
          </div>
          <div className="border-t border-cyan-500/10 px-3 py-2 text-center text-[10px] text-slate-500">
            <Link href="/contact" className="text-cyan-400 hover:underline">
              Contact page
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
