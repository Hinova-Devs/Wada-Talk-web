import type { Metadata } from "next";

// Internal Hinova tools (ops.<domain>). Never indexed, never linked from the public site.
export const metadata: Metadata = {
  title: { absolute: "Wada Ops", template: "%s · Wada Ops" },
  robots: { index: false, follow: false },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
