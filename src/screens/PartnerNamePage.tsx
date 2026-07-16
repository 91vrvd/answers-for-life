"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function PartnerNamePage() {
  const { state, dispatch } = useLoveBook();
  const [name, setName] = useState(state.partnerName);
  return <PageContainer className="form-page">
    <header className="simple-header"><TextButton aria-label="返回模式选择" onClick={() => dispatch({ type: "navigate", page: "mode" })}><ArrowLeft size={21} /></TextButton><span>和 TA 一起</span></header>
    <section className="form-copy">
      <p className="section-kicker">写下一个称呼</p>
      <h1>你想和谁<br />一起完成？</h1>
      <p>这只是你对 TA 的称呼，<br />不需要填写真实姓名。</p>
    </section>
    <div className="name-field-wrap">
      <label htmlFor="partner-name">TA 的称呼</label>
      <input id="partner-name" value={name} maxLength={12} autoFocus autoComplete="off" placeholder="例如：小周、宝宝、那个笨蛋" onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && name.trim()) dispatch({ type: "setName", name }); }} />
      <span>我的称呼：我</span>
    </div>
    <div className="sticky-actions">
      <PrimaryButton disabled={!name.trim()} onClick={() => dispatch({ type: "setName", name })}>下一步<ArrowRight size={18} /></PrimaryButton>
      <p>稍后你可以把结果发给 TA</p>
    </div>
  </PageContainer>;
}
