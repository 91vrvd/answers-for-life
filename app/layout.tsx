import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const description = "12个关于成长、生活、关系与现实的主题。行动清单用选择题，人生问题由自己写，并可完整保存为图片或答案册。";
  return {
    metadataBase: base,
    title: "给生活的答案",
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "给生活的答案", description, images: [{ url: new URL("/og-v5.png", base), width: 1672, height: 941 }] },
    twitter: { card: "summary_large_image", title: "给生活的答案", description, images: [new URL("/og-v5.png", base)] },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F8F6F2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
