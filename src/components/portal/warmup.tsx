"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

let warmed = false;
const recentSections = new Map<string, number>();

function limitedConnection() {
 const connection = (navigator as Navigator & {connection?: {saveData?: boolean; effectiveType?: string}}).connection;
 return connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
}

export function PortalSectionWarmup({links}: {links: string}) {
 const router = useRouter();
 useEffect(() => {
  if (process.env.NODE_ENV !== "production" || limitedConnection()) return;
  // At most two authorized read-only pages, staggered to avoid a request burst.
  const timers = links.split("\n").filter(Boolean).slice(0, 2).map((href, index) => setTimeout(() => {
   if (document.visibilityState === "hidden") return;
   const now = Date.now();
   const last = recentSections.get(href);
   if (last !== undefined && now - last < 30000) return;
   for (const [key, at] of recentSections) if (now - at >= 30000) recentSections.delete(key);
   recentSections.set(href, now);
   router.prefetch(href);
  }, 400 + index * 700));
  return () => timers.forEach(clearTimeout);
 }, [links, router]);
 return null;
}

export function PortalWarmup() {
 const router = useRouter();
 useEffect(() => {
  if (warmed || process.env.NODE_ENV !== "production") return;
  if (limitedConnection()) return;
  function warm() {
   if (warmed) return;
   warmed = true;
   // Public entry pages only. Protected records remain live and authorization-scoped.
   for (const href of ["/login", "/register"]) {
    if (window.location.pathname !== href) router.prefetch(href);
   }
  }
  if ("requestIdleCallback" in window) {
   const idle = window.requestIdleCallback(warm, {timeout: 2500});
   return () => window.cancelIdleCallback(idle);
  }
  const timer = setTimeout(warm, 1200);
  return () => clearTimeout(timer);
 }, [router]);
 return null;
}
