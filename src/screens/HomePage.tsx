"use client";

import { ArrowRight, BookOpenText } from "lucide-react";
import { PageContainer, PrimaryButton } from "@/src/components/ui";
import { getLifeTheme } from "@/src/data/themes";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function HomePage() {
  const { state, dispatch } = useLoveBook();
  const currentTheme = getLifeTheme(state.selectedThemeId);
  const hasThemeProgress = Boolean(currentTheme && state.themeResponseMode && state.selectedThemeItemIds.length);
  const progressPage = state.themeIndex >= state.selectedThemeItemIds.length ? "themeResult" : state.themeResponseMode === "write" ? "themeWrite" : "themeChoice";
  return <PageContainer className="home-page">
    <div className="home-top">
      <p className="eyebrow">ANSWERS IN THE MARGINS</p>
      <div className="relationship-lines" aria-hidden="true"><i /><i /><b /></div>
      <div className="home-title-block">
        <h1>留白<br /><em>答案</em></h1>
        <p className="home-subtitle">有些问题不必立刻想清楚，<br />可以先认真回答一次。</p>
      </div>
    </div>
    <div className="home-actions">
      <p className="home-description">12 个关于成长、生活、关系与现实的主题，<br />有些凭直觉选择，有些留给自己写。</p>
      <PrimaryButton onClick={() => dispatch({ type: "navigate", page: hasThemeProgress ? progressPage : "themes" })}>
        {hasThemeProgress ? "继续刚才的答案" : "选择一个主题"}<ArrowRight size={18} />
      </PrimaryButton>
      <div className="home-topic-note"><BookOpenText size={15} /><span>{currentTheme && hasThemeProgress ? `正在回答：${currentTheme.title}` : "题型清楚区分 · 完成后完整导出"}</span></div>
      <p className="privacy-note">无需注册 · 答案默认仅保存在当前设备</p>
    </div>
  </PageContainer>;
}
