"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  DASHBOARD_NAV_SECTIONS,
  DASHBOARD_UTILITY_LINKS,
  EMPLOYEE_NAV_LINKS,
} from "@/lib/dashboard-nav";

const STORAGE_OPEN = "me-dashboard-sidebar-open";
const STORAGE_AUTO = "me-dashboard-sidebar-auto-hide";

type Props = {
  isEmployee: boolean;
  children: React.ReactNode;
};

export function DashboardShell({ isEmployee, children }: Props) {
  const pathname = usePathname();
  const autoHideLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoHide, setAutoHide] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const headingId = useId();

  useEffect(() => {
    try {
      const o = localStorage.getItem(STORAGE_OPEN);
      if (o === "0") setSidebarOpen(false);
      if (o === "1") setSidebarOpen(true);
      const a = localStorage.getItem(STORAGE_AUTO);
      if (a === "1") setAutoHide(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_OPEN, sidebarOpen ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [sidebarOpen, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_AUTO, autoHide ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [autoHide, hydrated]);

  const clearLeaveTimer = useCallback(() => {
    if (autoHideLeaveTimer.current) {
      clearTimeout(autoHideLeaveTimer.current);
      autoHideLeaveTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (!autoHide) return;
    clearLeaveTimer();
    autoHideLeaveTimer.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 450);
  }, [autoHide, clearLeaveTimer]);

  const onSidebarEnter = useCallback(() => {
    clearLeaveTimer();
  }, [clearLeaveTimer]);

  const onSidebarLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, [clearLeaveTimer]);

  /** When auto-hide is on, reopen briefly after navigation so users see where they are */
  useEffect(() => {
    if (autoHide && hydrated) {
      setSidebarOpen(true);
      const t = setTimeout(() => {
        if (autoHide) setSidebarOpen(false);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [pathname, autoHide, hydrated]);

  const pathOnly = (href: string) => href.split("#")[0].split("?")[0];

  const navLinkClass = (href: string) => {
    const base = pathOnly(href);
    const active =
      base === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === base || pathname.startsWith(`${base}/`);
    return active
      ? "font-medium text-accent"
      : "text-muted hover:text-foreground";
  };

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      {/* Peek zone: hover to open when sidebar is hidden */}
      {!sidebarOpen ? (
        <button
          type="button"
          aria-label="Open navigation ribbon"
          className="fixed left-0 top-1/2 z-40 hidden h-24 w-3 -translate-y-1/2 rounded-r-md border border-border border-l-0 bg-card/95 shadow-md backdrop-blur-sm lg:block"
          onMouseEnter={() => setSidebarOpen(true)}
        />
      ) : null}

      {/* Mobile top bar */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm"
          aria-expanded={sidebarOpen}
          aria-controls={headingId}
        >
          <span aria-hidden>{sidebarOpen ? "◀" : "▶"}</span>
          Navigation
        </button>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={autoHide}
            onChange={(e) => setAutoHide(e.target.checked)}
          />
          Auto-hide
        </label>
      </div>

      {/* Sidebar */}
      <aside
        id={headingId}
        onMouseEnter={onSidebarEnter}
        onMouseLeave={onSidebarLeave}
        className={[
          "z-30 w-full shrink-0 rounded-xl border border-border bg-card/95 shadow-sm backdrop-blur-sm transition-[max-height,opacity] duration-200 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-72 lg:overflow-y-auto",
          sidebarOpen
            ? "max-h-[2000px] opacity-100 lg:block"
            : "max-h-0 overflow-hidden border-0 py-0 opacity-0 lg:hidden",
        ].join(" ")}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Navigate
            </h2>
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:bg-background"
                title="Hide ribbon"
              >
                Hide
              </button>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={autoHide}
                  onChange={(e) => setAutoHide(e.target.checked)}
                />
                Auto-hide
              </label>
            </div>
          </div>

          <nav aria-label="Dashboard sections" className="space-y-5">
            {DASHBOARD_NAV_SECTIONS.map((section) => (
              <div key={section.id}>
                <h3 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                <p className="mt-1 text-xs leading-snug text-muted">
                  {section.description}
                </p>
                <ul className="mt-2 space-y-1.5 border-l-2 border-accent/25 pl-3">
                  {section.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={`text-sm ${navLinkClass(link.href)}`}
                      >
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              More
            </h3>
            <ul className="mt-2 space-y-1.5">
              {DASHBOARD_UTILITY_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className={`text-sm ${navLinkClass(link.href)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isEmployee
                ? EMPLOYEE_NAV_LINKS.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={`text-sm ${navLinkClass(link.href)}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
