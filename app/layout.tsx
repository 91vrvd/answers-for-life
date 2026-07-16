import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const description = "从100件关于爱的小事中，找到想和TA完成的答案，也找到认真爱自己的方式。";
  return {
    metadataBase: base,
    title: "关于爱的100件小事",
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "关于爱的100件小事", description, images: [{ url: new URL("/og-v2.png", base), width: 1672, height: 941 }] },
    twitter: { card: "summary_large_image", title: "关于爱的100件小事", description, images: [new URL("/og-v2.png", base)] },
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
