"use client";

import { ArrowRight } from "lucide-react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function HomePage() {
  const { state, dispatch } = useLoveBook();
  const hasProgress = Boolean(state.mode && state.selectedTaskIds.length && state.currentIndex < state.selectedTaskIds.length && Object.keys(state.answers).length);
  return <PageContainer className="home-page">
    <div className="home-top">
      <p className="eyebrow">100 LITTLE THINGS ABOUT LOVE</p>
      <div className="relationship-lines" aria-hidden="true"><i /><i /><b /></div>
      <div className="home-title-block">
        <h1>关于爱的<br /><em>100</em> 件小事</h1>
        <p className="home-subtitle">爱可以写给彼此，<br />也可以认真留给自己。</p>
      </div>
    </div>
    <div className="home-actions">
      <p className="home-description">从 100 件关于爱的小事里，<br />找到你此刻真正想要的生活。</p>
      <PrimaryButton onClick={() => dispatch({ type: "navigate", page: hasProgress ? "questions" : "mode" })}>
        {hasProgress ? "继续刚才的答案" : "开始一份答案"}<ArrowRight size={18} />
      </PrimaryButton>
      <TextButton onClick={() => dispatch({ type: "setMode", mode: "couple" })}>我收到了一份邀请</TextButton>
      <p className="privacy-note">无需注册 · 答案默认仅你们可见</p>
    </div>
  </PageContainer>;
}
