"use client";

import { BookOpen, Check, Heart, House, UserRound } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Page } from "@/src/state/LoveBookContext";

export function PageContainer({ children, className = "", bottomNav = false }: { children: ReactNode; className?: string; bottomNav?: boolean }) {
  return <main className={`page ${bottomNav ? "page-with-nav" : ""} ${className}`}>{children}</main>;
}

export function PrimaryButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button primary-button ${className}`} {...props}>{children}</button>;
}

export function SecondaryButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button secondary-button ${className}`} {...props}>{children}</button>;
}

export function TextButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`text-button ${className}`} {...props}>{children}</button>;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="progress-track" aria-label={`完成 ${Math.round(value * 100)}%`}><span style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} /></div>;
}

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return <div className={`toast ${visible ? "toast-visible" : ""}`} role="status"><Check size={16} />{message}</div>;
}

export function BottomNavigation({ active, onNavigate }: { active: "answers" | "things" | "us"; onNavigate: (page: Page) => void }) {
  const items = [
    { id: "answers", label: "答案", icon: BookOpen, page: "couple" as Page },
    { id: "things", label: "小事", icon: Heart, page: "things" as Page },
    { id: "us", label: "我们", icon: UserRound, page: "things" as Page },
  ];
  return <nav className="bottom-nav" aria-label="主要导航">{items.map((item) => {
    const Icon = item.icon;
    return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onNavigate(item.page)}><Icon size={20} strokeWidth={1.7} /><span>{item.label}</span></button>;
  })}</nav>;
}

export function EmptyStateIcon() {
  return <div className="empty-state-icon"><House size={23} strokeWidth={1.5} /></div>;
}
