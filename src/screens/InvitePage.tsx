"use client";

import { ArrowLeft, Copy, ImageDown, WandSparkles } from "lucide-react";
import { useState } from "react";
import { ShareCard } from "@/src/components/ShareCard";
import { PageContainer, PrimaryButton, SecondaryButton, TextButton, Toast } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function InvitePage() {
  const { state, dispatch } = useLoveBook();
  const [toast, setToast] = useState("");
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const copyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}?invite=demo`;
    try { await navigator.clipboard.writeText(link); showToast("邀请链接已复制"); }
    catch { showToast("请长按地址栏复制链接"); }
  };
  return <PageContainer className="invite-page">
    <header className="simple-header"><TextButton aria-label="返回结果" onClick={() => dispatch({ type: "navigate", page: "personal" })}><ArrowLeft size={21} /></TextButton><span>邀请</span></header>
    <section className="invite-copy"><p className="section-kicker">让答案去见 TA</p><h1>把这份答案<br />发给 TA</h1><p>TA 完成选择以后，你们会看到彼此共同期待的事情。</p></section>
    <ShareCard partnerName={state.partnerName} />
    <div className="invite-actions">
      <PrimaryButton onClick={copyLink}><Copy size={17} />复制邀请链接</PrimaryButton>
      <SecondaryButton onClick={() => dispatch({ type: "simulatePartner" })}><WandSparkles size={17} />模拟 TA 已完成</SecondaryButton>
      <TextButton className="save-card-button" onClick={() => showToast("请使用系统截图保存这张卡片")}><ImageDown size={16} />保存邀请卡片</TextButton>
    </div>
    <p className="simulation-note">当前为前端原型，不会触发真实微信分享</p>
    <Toast message={toast} visible={Boolean(toast)} />
  </PageContainer>;
}
