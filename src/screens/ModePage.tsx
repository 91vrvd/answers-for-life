"use client";

import { ArrowLeft, ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
import { PageContainer, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ModePage() {
  const { dispatch } = useLoveBook();
  return <PageContainer className="mode-page">
    <header className="simple-header"><TextButton aria-label="返回首页" onClick={() => dispatch({ type: "navigate", page: "home" })}><ArrowLeft size={21} /></TextButton><span>选择一种爱的方式</span></header>
    <section className="mode-copy"><p className="section-kicker">LOVE HAS MORE THAN ONE DIRECTION</p><h1>这一次，<br />想把爱写给谁？</h1><p>可以是你在意的那个人，<br />也可以是一直陪你走到现在的自己。</p></section>
    <div className="mode-options">
      <button onClick={() => dispatch({ type: "setMode", mode: "couple" })}><span className="mode-icon"><HeartHandshake size={23} strokeWidth={1.5} /></span><div><small>和喜欢的人</small><strong>我们一起完成</strong><p>看看你们共同期待怎样的爱</p></div><ArrowRight size={19} /></button>
      <button className="self-mode" onClick={() => dispatch({ type: "setMode", mode: "self" })}><span className="mode-icon"><Sparkles size={23} strokeWidth={1.5} /></span><div><small>写给自己</small><strong>好好爱自己</strong><p>看看此刻的你最需要怎样生活</p></div><ArrowRight size={19} /></button>
    </div>
    <p className="mode-note">两种答案都会只保存在当前浏览器</p>
  </PageContainer>;
}
