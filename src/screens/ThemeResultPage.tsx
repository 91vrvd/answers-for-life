"use client";
/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, Download, FileText, Images, RotateCcw } from "lucide-react";
import { useState } from "react";
import { PageContainer, PrimaryButton, SecondaryButton, TextButton, Toast } from "@/src/components/ui";
import { getLifeTheme } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";
import { downloadThemeExportPage, generateThemeAnswerImages, type ThemeExportPage } from "@/src/utils/exportThemeImages";

export function ThemeResultPage() {
  const { state, dispatch } = useLoveBook();
  const theme = getLifeTheme(state.selectedThemeId);
  const [pages, setPages] = useState<ThemeExportPage[]>([]);
  const [busy, setBusy] = useState<"images" | "word" | null>(null);
  const [toast, setToast] = useState("");
  if (!theme || !state.themeResponseMode) return null;
  const currentTheme = theme;
  const items = state.selectedThemeItemIds.map((id) => theme.items.find((item) => item.id === id)).filter(Boolean);
  const writtenCount = items.filter((item) => item && state.themeWrittenAnswers[item.id]?.trim()).length;
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 1800); };

  async function createImages() {
    setBusy("images");
    try {
      const generated = await generateThemeAnswerImages({ theme: currentTheme, itemIds: state.selectedThemeItemIds, mode: state.themeResponseMode!, choiceAnswers: state.themeChoiceAnswers, writtenAnswers: state.themeWrittenAnswers });
      setPages(generated);
      showToast(`已生成 ${generated.length} 张完整答案图`);
    } catch { showToast("图片生成失败，请稍后重试"); }
    finally { setBusy(null); }
  }

  async function createWord() {
    setBusy("word");
    try {
      const { downloadThemeWord } = await import("@/src/utils/exportThemeWord");
      await downloadThemeWord({ theme: currentTheme, itemIds: state.selectedThemeItemIds, writtenAnswers: state.themeWrittenAnswers });
      showToast("可填写 Word 答案册已导出");
    } catch { showToast("Word 导出失败，请稍后重试"); }
    finally { setBusy(null); }
  }

  return <PageContainer className="theme-result-page">
    <header className="simple-header"><TextButton aria-label="返回主题" onClick={() => dispatch({ type: "navigate", page: "themes" })}><ArrowLeft size={21} /></TextButton><span>答案已保存</span></header>
    <section className="theme-result-hero"><p className="eyebrow">YOUR ANSWERS, KEPT TOGETHER</p><h1>这是你留给生活的<br /><em>{items.length}</em> 份答案</h1><p>{theme.title}</p><small>{state.themeResponseMode === "write" ? `已写下 ${writtenCount} 题，留空的题也会保存在答案册里。` : "每一次选择都已整理，生成图片时不会遗漏任何一题。"}</small></section>
    <section className="complete-answer-list"><div className="section-heading"><span>全部答案</span><small>ALL ANSWERS</small></div>{items.map((item, index) => {
      if (!item) return null;
      const choice = theme.choices.find((candidate) => candidate.value === state.themeChoiceAnswers[item.id]);
      const answer = state.themeResponseMode === "write" ? state.themeWrittenAnswers[item.id]?.trim() : choice?.label;
      return <article key={item.id}><b>{String(index + 1).padStart(2, "0")}</b><div><small>{item.category}</small><h2>{item.writingPrompt}</h2><p className={!answer ? "empty" : ""}>{answer || "这道题留给以后继续写"}</p></div></article>;
    })}</section>
    <section className="theme-export-panel"><p className="section-kicker">SAVE & CONTINUE</p><h2>把这份答案带走</h2><p>图片会按页生成，包含本次全部题目与答案，适合保存或分享。</p><PrimaryButton disabled={busy !== null} onClick={createImages}><Images size={18} />{busy === "images" ? "正在整理全部答案…" : "生成完整答案图片"}</PrimaryButton>
      {state.themeResponseMode === "write" && <SecondaryButton disabled={busy !== null} onClick={createWord}><FileText size={18} />{busy === "word" ? "正在生成 Word…" : "导出可填写 Word 答案册"}</SecondaryButton>}
    </section>
    {pages.length > 0 && <section className="generated-answer-pages"><div className="section-heading"><span>共 {pages.length} 张</span><small>答案没有被省略</small></div><div className="answer-page-grid">{pages.map((page, index) => <button key={page.name} onClick={() => downloadThemeExportPage(page)}><img src={page.url} alt={`完整答案第 ${index + 1} 页`} /><span>保存第 {index + 1} 张 <Download size={13} /></span></button>)}</div><SecondaryButton onClick={() => pages.forEach((page, index) => window.setTimeout(() => downloadThemeExportPage(page), index * 180))}><Download size={18} />依次下载全部图片</SecondaryButton></section>}
    <div className="theme-result-actions"><SecondaryButton onClick={() => dispatch({ type: "restartTheme" })}><RotateCcw size={17} />重新选择题量</SecondaryButton><TextButton onClick={() => dispatch({ type: "navigate", page: "themes" })}>回答另一个主题</TextButton></div>
    <Toast visible={Boolean(toast)} message={toast} />
  </PageContainer>;
}
