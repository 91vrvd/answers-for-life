"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function IntroPage() {
  const { state, dispatch } = useLoveBook();
  const isSelf = state.mode === "self";
  const samples = [
    { icon: Sparkles, label: isSelf ? "很想为自己做" : "很想和 TA 做", className: "want" },
    { icon: CheckCircle2, label: isSelf ? "已经为自己做过" : "已经一起做过", className: "done" },
    { icon: Circle, label: "暂时没感觉", className: "skip" },
  ];
  return <PageContainer className="intro-page">
    <header className="simple-header"><TextButton aria-label="返回题量选择" onClick={() => dispatch({ type: "navigate", page: "count" })}><ArrowLeft size={21} /></TextButton><span>{state.questionCount} 题 · 已固定</span></header>
    <section className="intro-copy">
      <p className="section-kicker">凭第一感觉就好</p>
      <h1>{isSelf ? <>选出真正想<br />为自己做的事</> : <>先选出让你<br />心动的小事</>}</h1>
      <p>接下来会出现 {state.questionCount} 件关于爱的日常。<br />没有标准答案，也不需要勉强自己心动。</p>
    </section>
    <div className="sample-stack">{samples.map(({ icon: Icon, label, className }, index) => <div className={`sample-card ${className}`} key={label} style={{ "--sample-index": index } as React.CSSProperties}><Icon size={19} strokeWidth={1.6} /><span>{label}</span><small>轻轻点一下</small></div>)}</div>
    <div className="sticky-actions"><PrimaryButton onClick={() => dispatch({ type: "navigate", page: "questions" })}>开始选择<ArrowRight size={18} /></PrimaryButton></div>
  </PageContainer>;
}
