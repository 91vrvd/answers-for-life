"use client";

import { ArrowLeft, Check, Circle, Sparkles } from "lucide-react";
import { PageContainer, ProgressBar, TextButton } from "@/src/components/ui";
import { getLifeTheme } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ThemeChoicePage() {
  const { state, dispatch } = useLoveBook();
  const theme = getLifeTheme(state.selectedThemeId);
  const itemId = state.selectedThemeItemIds[state.themeIndex];
  const item = theme?.items.find((candidate) => candidate.id === itemId);
  if (!theme || !item) return null;
  const icons = [Check, Sparkles, Circle];
  return <PageContainer className="theme-answer-page">
    <header className="theme-answer-header"><div><TextButton aria-label="上一题或返回" onClick={() => state.themeIndex ? dispatch({ type: "previousThemeItem" }) : dispatch({ type: "navigate", page: "themeCount" })}><ArrowLeft size={21} /></TextButton><span>{String(state.themeIndex + 1).padStart(2, "0")} <i>/</i> {String(state.selectedThemeItemIds.length).padStart(2, "0")}</span><b>{theme.family} · 选择</b></div><ProgressBar value={(state.themeIndex + 1) / state.selectedThemeItemIds.length} /></header>
    <section className="theme-question-card" key={item.id}><div><span>{item.category}</span><small>NO. {String(state.themeIndex + 1).padStart(2, "0")}</small></div><article><h1>{item.title}</h1><p>{item.description}</p></article><footer>{theme.choicePrompt}</footer></section>
    <div className="theme-choice-actions">{theme.choices.map((choice, index) => { const Icon = icons[index]; return <button className={`${choice.tone} ${state.themeChoiceAnswers[item.id] === choice.value ? "selected" : ""}`} key={choice.value} onClick={() => dispatch({ type: "answerThemeChoice", itemId: item.id, value: choice.value })}><Icon size={18} /><span>{choice.label}</span></button>; })}</div>
  </PageContainer>;
}
