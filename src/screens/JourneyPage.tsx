"use client";

import { ArrowLeft, ArrowRight, ListChecks, PenLine } from "lucide-react";
import { PageContainer, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function JourneyPage() {
  const { state, dispatch } = useLoveBook();
  const isSelf = state.mode === "self";
  return <PageContainer className="journey-page">
    <header className="simple-header"><TextButton aria-label="返回爱的方向" onClick={() => dispatch({ type: "navigate", page: "mode" })}><ArrowLeft size={21} /></TextButton><span>{isSelf ? "写给自己" : "和喜欢的人"}</span></header>
    <section className="journey-copy"><p className="section-kicker">两种不同的靠近方式</p><h1>这一次，<br />想怎样回答爱？</h1><p>可以凭第一感觉选出想做的小事，<br />也可以坐下来，认真写几句心里话。</p></section>
    <div className="journey-options">
      <button onClick={() => dispatch({ type: "setJourney", journey: "actions" })}><span><ListChecks size={23} strokeWidth={1.5} /></span><div><small>轻松选择</small><strong>100件小事</strong><p>{isSelf ? "选出真正想为自己做的行动" : "看看你们会不会想做同一件事"}</p></div><ArrowRight size={19} /></button>
      <button className="reflection-option" onClick={() => dispatch({ type: "setJourney", journey: "reflection" })}><span><PenLine size={23} strokeWidth={1.5} /></span><div><small>开放书写 · 新</small><strong>12分钟真心问答</strong><p>{isSelf ? "建立只属于你的爱自己说明书" : "用自己的话，认真认识彼此"}</p></div><ArrowRight size={19} /></button>
    </div>
    <p className="mode-note">问答没有标准答案，也可以随时跳过</p>
  </PageContainer>;
}
