"use client";

import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { useState } from "react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { useLoveBook } from "@/src/state/LoveBookContext";

const choices = [
  { count: 3, label: "轻轻写", time: "约 5 分钟" },
  { count: 6, label: "认真写", time: "约 12 分钟", recommended: true },
  { count: 12, label: "慢慢写", time: "约 25 分钟" },
];

export function ReflectionIntroPage() {
  const { state, dispatch } = useLoveBook();
  const [count, setCount] = useState(state.reflectionCount || 6);
  const isSelf = state.mode === "self";
  const backPage = state.mode === "couple" ? "name" : "journey";
  return <PageContainer className="reflection-intro-page">
    <header className="simple-header"><TextButton aria-label="返回" onClick={() => dispatch({ type: "navigate", page: backPage })}><ArrowLeft size={21} /></TextButton><span>真心问答</span></header>
    <section className="reflection-intro-copy"><p className="section-kicker">WRITE WHAT IS TRUE</p><h1>{isSelf ? <>用几分钟，<br />真正听见自己</> : <>有些答案，<br />要亲手写下来</>}</h1><p>{isSelf ? "这里不会告诉你怎样才算爱自己。问题只帮助你看见：什么让你舒服，什么对未来真的有益。" : "不用给出正确答案，也不用一次说完所有事。只写此刻真实想到的部分。"}</p></section>
    <div className="reflection-counts">{choices.map((choice) => <button key={choice.count} className={count === choice.count ? "selected" : ""} onClick={() => setCount(choice.count)}><div><strong>{choice.count}</strong><span>题</span>{choice.recommended && <small>推荐</small>}</div><p>{choice.label}</p><em><Clock3 size={12} />{choice.time}</em></button>)}</div>
    <div className="reflection-principle"><span>{isSelf ? "本次原则" : "回答提示"}</span><p>{isSelf ? "同时照顾当下体验，也照顾未来的自己。" : "谈具体感受，不猜测，不替对方下结论。"}</p></div>
    <div className="sticky-actions"><PrimaryButton onClick={() => dispatch({ type: "prepareReflection", count })}>开始写 {count} 个答案<ArrowRight size={18} /></PrimaryButton><p>每写完一题都会自动保存在当前设备</p></div>
  </PageContainer>;
}
