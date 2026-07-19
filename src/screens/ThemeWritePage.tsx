"use client";

import { ArrowLeft, ArrowRight, House } from "lucide-react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { getLifeTheme } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ThemeWritePage() {
  const { state, dispatch } = useLoveBook();
  const theme = getLifeTheme(state.selectedThemeId);
  const itemId = state.selectedThemeItemIds[state.themeIndex];
  const item = theme?.items.find((candidate) => candidate.id === itemId);
  if (!theme || !item) return null;
  const answer = state.themeWrittenAnswers[item.id] ?? "";
  return <PageContainer className="theme-write-page">
    <header className="theme-answer-header"><div><TextButton aria-label="上一题或返回" onClick={() => state.themeIndex ? dispatch({ type: "previousThemeItem" }) : dispatch({ type: "navigate", page: "themeCount" })}><ArrowLeft size={21} /></TextButton><TextButton aria-label="返回首页" onClick={() => dispatch({ type: "navigate", page: "home" })}><House size={17} /></TextButton><span>{String(state.themeIndex + 1).padStart(2, "0")} <i>/</i> {String(state.selectedThemeItemIds.length).padStart(2, "0")}</span><b>{theme.family} · 写下</b></div><div className="progress-track"><span style={{ width: `${((state.themeIndex + 1) / state.selectedThemeItemIds.length) * 100}%`, background: "var(--sage)" }} /></div></header>
    <section className="theme-writing-sheet" key={item.id}><div className="theme-writing-label"><span>{item.category}</span><small>答案会自动保存</small></div><h1>{item.writingPrompt}</h1><p>{item.writingHelper}</p><textarea autoFocus value={answer} maxLength={1200} onChange={(event) => dispatch({ type: "setThemeWrittenAnswer", itemId: item.id, value: event.target.value })} placeholder="从此刻最真实的一句话开始……" /><div className="theme-writing-meta"><span>{answer.trim() ? "已经写下一份答案" : "可以留空，以后继续写"}</span><b>{answer.length} / 1200</b></div></section>
    <div className="theme-write-actions"><TextButton onClick={() => dispatch({ type: "nextThemeItem" })}>{answer.trim() ? "保存并继续" : "暂时留空"}</TextButton><PrimaryButton onClick={() => dispatch({ type: "nextThemeItem" })}>{state.themeIndex + 1 === state.selectedThemeItemIds.length ? "整理全部答案" : "下一题"}<ArrowRight size={18} /></PrimaryButton></div>
  </PageContainer>;
}
