import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const description = "选出你最想和 TA 一起做的事情，看看你们会不会想到同一个答案。";
  return {
    metadataBase: base,
    title: "关于爱的100件小事",
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "关于爱的100件小事", description, images: [{ url: new URL("/og.png", base), width: 1672, height: 941 }] },
    twitter: { card: "summary_large_image", title: "关于爱的100件小事", description, images: [new URL("/og.png", base)] },
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
