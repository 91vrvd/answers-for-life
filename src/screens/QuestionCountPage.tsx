"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { PageContainer, PrimaryButton, TextButton } from "@/src/components/ui";
import { QUESTION_COUNTS } from "@/src/data/tasks";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function QuestionCountPage() {
  const { state, dispatch } = useLoveBook();
  const [count, setCount] = useState(state.questionCount || 15);
  const backPage = state.mode === "couple" ? "name" : "mode";
  const time = count <= 15 ? "约 2–3 分钟" : count <= 30 ? "约 5 分钟" : count <= 50 ? "约 8 分钟" : "约 15 分钟";
  return <PageContainer className="count-page">
    <header className="simple-header"><TextButton aria-label="返回" onClick={() => dispatch({ type: "navigate", page: backPage })}><ArrowLeft size={21} /></TextButton><span>选择题量</span></header>
    <section className="count-copy"><p className="section-kicker">按今天的心情来</p><h1>这一次，<br />想回答多少题？</h1><p>题目会从完整 100 题中均衡随机抽取。<br />本轮开始后，刷新页面也不会换题。</p></section>
    <div className="count-options" role="radiogroup" aria-label="选择题目数量">
      {QUESTION_COUNTS.map((option) => <button role="radio" aria-checked={count === option} className={count === option ? "selected" : ""} key={option} onClick={() => setCount(option)}><strong>{option}</strong><span>题</span>{option === 15 && <small>推荐</small>}</button>)}
    </div>
    <div className="count-estimate"><span>预计用时</span><strong>{time}</strong></div>
    <div className="sticky-actions"><PrimaryButton onClick={() => dispatch({ type: "prepareQuiz", count })}>就选 {count} 题<ArrowRight size={18} /></PrimaryButton><p>每一类爱的表达都会尽量均衡出现</p></div>
  </PageContainer>;
}
