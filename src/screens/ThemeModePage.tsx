"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, PenLine } from "lucide-react";
import { PageContainer, TextButton } from "@/src/components/ui";
import { getLifeTheme } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ThemeModePage() {
  const { state, dispatch } = useLoveBook();
  const theme = getLifeTheme(state.selectedThemeId);
  if (!theme) return null;
  return <PageContainer className="theme-mode-page">
    <header className="simple-header"><TextButton aria-label="返回主题" onClick={() => dispatch({ type: "navigate", page: "themes" })}><ArrowLeft size={21} /></TextButton><span>{theme.items.length} 题题库</span></header>
    <section className="theme-mode-copy"><p className="eyebrow">{theme.kicker}</p><h1>{theme.title}</h1><p>{theme.description}</p></section>
    <div className="response-mode-options">
      <button onClick={() => dispatch({ type: "setThemeResponseMode", mode: "choice" })}><span><CheckCircle2 size={22} /></span><div><small>QUICK CHOICE</small><strong>凭第一感觉选择</strong><p>三种直觉答案，完成后保存包含全部题目的答案图片。</p></div><ArrowRight size={18} /></button>
      <button className="write-option" onClick={() => dispatch({ type: "setThemeResponseMode", mode: "write" })}><span><PenLine size={22} /></span><div><small>WRITE IT DOWN</small><strong>亲手写下答案</strong><p>自由写下每道题，完成后可导出完整图片和可继续编辑的 Word 答案册。</p></div><ArrowRight size={18} /></button>
    </div>
    <p className="theme-mode-note">下一步可以选择本次回答多少题</p>
  </PageContainer>;
}
