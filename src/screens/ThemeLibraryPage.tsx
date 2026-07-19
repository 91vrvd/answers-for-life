"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { PageContainer, TextButton } from "@/src/components/ui";
import { lifeThemes, type ThemeFamily } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";

const filters: Array<"全部" | ThemeFamily> = ["全部", "成长", "生活", "关系", "现实"];

export function ThemeLibraryPage() {
  const { dispatch } = useLoveBook();
  const [filter, setFilter] = useState<(typeof filters)[number]>("全部");
  const themes = filter === "全部" ? lifeThemes : lifeThemes.filter((theme) => theme.family === filter);
  return <PageContainer className="theme-library-page">
    <header className="simple-header"><TextButton aria-label="返回首页" onClick={() => dispatch({ type: "navigate", page: "home" })}><ArrowLeft size={21} /></TextButton><span>12 份主题答案</span></header>
    <section className="theme-library-copy">
      <p className="eyebrow">CHOOSE WHAT MATTERS NOW</p>
      <h1>此刻，你最想回答什么？</h1>
      <p>每个主题都可以快速选择，也可以亲手写下答案。题目数量由你决定。</p>
    </section>
    <nav className="theme-filters" aria-label="主题分类">{filters.map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</nav>
    <section className="theme-list">{themes.map((theme) => <button className={theme.featured ? "featured" : ""} key={theme.id} onClick={() => dispatch({ type: "selectTheme", themeId: theme.id })}>
      <span className="theme-list-number">{String(lifeThemes.indexOf(theme) + 1).padStart(2, "0")}</span>
      <div><small>{theme.kicker}</small><h2>{theme.title}</h2><p>{theme.subtitle}</p><footer><span>{theme.family}</span><span>{theme.items.length} 题题库</span></footer></div>
      <ArrowRight size={18} />
    </button>)}</section>
    <p className="theme-local-note">答案仅保存在当前设备，不需要注册。</p>
  </PageContainer>;
}
