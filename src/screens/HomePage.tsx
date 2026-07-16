"use client";

import { ArrowRight } from "lucide-react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function HomePage() {
  const { state, dispatch } = useLoveBook();
  const hasProgress = state.partnerName && Object.keys(state.answers).length > 0 && Object.keys(state.answers).length < 15;
  return <PageContainer className="home-page">
    <div className="home-top">
      <p className="eyebrow">100 LITTLE THINGS ABOUT LOVE</p>
      <div className="relationship-lines" aria-hidden="true"><i /><i /><b /></div>
      <div className="home-title-block">
        <h1>关于爱的<br /><em>100</em> 件小事</h1>
        <p className="home-subtitle">有些关于爱的答案，<br />要两个人一起完成。</p>
      </div>
    </div>
    <div className="home-actions">
      <p className="home-description">选出你最想和 TA 一起做的事情，<br />看看你们会不会想到同一个答案。</p>
      <PrimaryButton onClick={() => dispatch({ type: "navigate", page: hasProgress ? "questions" : "name" })}>
        {hasProgress ? "继续我们的答案" : "开始我们的答案"}<ArrowRight size={18} />
      </PrimaryButton>
      <TextButton onClick={() => dispatch({ type: "navigate", page: "name" })}>我收到了一份邀请</TextButton>
      <p className="privacy-note">无需注册 · 答案默认仅你们可见</p>
    </div>
  </PageContainer>;
}
