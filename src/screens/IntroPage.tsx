"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

const samples = [
  { icon: Sparkles, label: "很想和 TA 做", className: "want" },
  { icon: CheckCircle2, label: "已经一起做过", className: "done" },
  { icon: Circle, label: "暂时没感觉", className: "skip" },
];

export function IntroPage() {
  const { dispatch } = useLoveBook();
  return <PageContainer className="intro-page">
    <header className="simple-header"><TextButton aria-label="返回" onClick={() => dispatch({ type: "navigate", page: "name" })}><ArrowLeft size={21} /></TextButton><span>02 / 03</span></header>
    <section className="intro-copy">
      <p className="section-kicker">凭第一感觉就好</p>
      <h1>先选出让你<br />心动的小事</h1>
      <p>接下来会出现 15 件关于爱的日常。<br />没有标准答案，只需要凭第一感觉选择。</p>
    </section>
    <div className="sample-stack">{samples.map(({ icon: Icon, label, className }, index) => <div className={`sample-card ${className}`} key={label} style={{ "--sample-index": index } as React.CSSProperties}><Icon size={19} strokeWidth={1.6} /><span>{label}</span><small>轻轻点一下</small></div>)}</div>
    <div className="sticky-actions"><PrimaryButton onClick={() => dispatch({ type: "navigate", page: "questions" })}>开始选择<ArrowRight size={18} /></PrimaryButton></div>
  </PageContainer>;
}
