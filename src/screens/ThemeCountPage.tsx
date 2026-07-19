"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { getLifeTheme, getThemeCountOptions } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ThemeCountPage() {
  const { state, dispatch } = useLoveBook();
  const theme = getLifeTheme(state.selectedThemeId);
  const options = useMemo(() => theme && state.themeResponseMode ? getThemeCountOptions(theme, state.themeResponseMode) : [], [theme, state.themeResponseMode]);
  const recommended = state.themeResponseMode === "write" ? (options.includes(6) ? 6 : options[0]) : (options.includes(12) ? 12 : options[0]);
  const [count, setCount] = useState(recommended ?? 0);
  if (!theme || !state.themeResponseMode) return null;
  const minutes = state.themeResponseMode === "write" ? `${Math.max(3, count * 2)}–${Math.max(5, count * 4)} 分钟` : `约 ${Math.max(1, Math.ceil(count / 6))}–${Math.max(2, Math.ceil(count / 3))} 分钟`;
  return <PageContainer className="theme-count-page">
    <header className="simple-header"><TextButton aria-label="返回回答方式" onClick={() => dispatch({ type: "navigate", page: "themeMode" })}><ArrowLeft size={21} /></TextButton><span>{state.themeResponseMode === "write" ? "自己写" : "快速选择"}</span></header>
    <section className="theme-count-copy"><p className="eyebrow">YOU SET THE PACE</p><h1>这次想回答多少题？</h1><p>系统会从不同分类中均衡抽取。少一点更容易完成，多一点更接近完整答案。</p></section>
    <div className="theme-count-options">{options.map((option) => <button className={count === option ? "selected" : ""} key={option} onClick={() => setCount(option)}>{option === recommended && <small>推荐</small>}<strong>{option}</strong><span>题</span></button>)}</div>
    <div className="theme-count-estimate"><span>本次主题</span><strong>{theme.title}</strong><span>预计用时</span><strong>{minutes}</strong></div>
    <div className="sticky-actions"><PrimaryButton disabled={!count} onClick={() => dispatch({ type: "prepareThemeRun", count })}>开始回答<ArrowRight size={18} /></PrimaryButton><p>进度会自动保存在浏览器中</p></div>
  </PageContainer>;
}
