"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageContainer, PrimaryButton, SecondaryButton } from "@/src/components/ui";
import { getTaskContent } from "@/src/data/tasks";
import { useLoveBook } from "@/src/state/LoveBookContext";
import { personalHeadline, selectedTasks, topCategory } from "@/src/utils/results";

export function PersonalResultPage() {
  const { state, dispatch } = useLoveBook();
  const [ready, setReady] = useState(false);
  const mode = state.mode ?? "couple";
  const isSelf = mode === "self";
  useEffect(() => { const timer = window.setTimeout(() => setReady(true), 1250); return () => window.clearTimeout(timer); }, []);
  const result = useMemo(() => {
    const pool = selectedTasks(state.selectedTaskIds);
    const wanted = pool.filter((task) => state.answers[task.id] === "want");
    const done = pool.filter((task) => state.answers[task.id] === "done");
    return {
      wanted,
      done,
      category: topCategory(state.answers, state.selectedTaskIds, mode),
      headline: personalHeadline(state.answers, state.selectedTaskIds, mode),
    };
  }, [mode, state.answers, state.selectedTaskIds]);

  if (!ready) return <PageContainer className="generating-page"><div className="generating-mark"><i /><i /><span /></div><h1>正在整理你<br />关于爱的答案……</h1><p>把每一个选择，放回属于它的位置</p></PageContainer>;

  const continueSelf = () => {
    const firstTaskId = result.wanted[0]?.id ?? state.selectedTaskIds[0] ?? 1;
    dispatch({ type: "setFirstTask", taskId: firstTaskId });
  };
  return <PageContainer className="result-page">
    <section className="result-hero">
      <p className="eyebrow">{isSelf ? "你给自己的答案" : "你的爱情偏好"}</p>
      <h1>{result.headline}</h1>
      <p>{isSelf ? "爱自己不是每一刻都积极，而是在疲惫、犹豫和不完美里，也愿意站在自己这一边。" : "对你来说，爱不只是一句表达，而是愿意把时间留给同一个人。"}</p>
    </section>
    <section className="result-summary" aria-label="选择结果摘要">
      <div><strong>{String(result.wanted.length).padStart(2, "0")}</strong><span>{isSelf ? "很想为自己完成" : "最想和 TA 完成"}</span></div>
      <div><strong>{String(result.done.length).padStart(2, "0")}</strong><span>{isSelf ? "已经为自己做过" : "已经一起做过"}</span></div>
      <div className="summary-category"><span>最常选择的类型</span><strong>{result.category}</strong></div>
    </section>
    <section className="top-things">
      <div className="section-heading"><span>{isSelf ? "最想送给自己的三件事" : "最想完成的三件事"}</span><small>MY TOP 3</small></div>
      {result.wanted.slice(0, 3).length ? result.wanted.slice(0, 3).map((task, index) => {
        const content = getTaskContent(task, mode);
        return <article key={task.id}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{content.title}</h3><p>{content.category}</p></div></article>;
      }) : <div className="soft-empty">你这次没有选择“很想做”。<br />答案本身也值得被认真看见。</div>}
    </section>
    <div className="result-actions">
      {isSelf ? <PrimaryButton onClick={continueSelf}>开始爱自己的第一件小事<ArrowRight size={18} /></PrimaryButton> : <PrimaryButton onClick={() => dispatch({ type: "navigate", page: "invite" })}>邀请 TA 看看答案<ArrowRight size={18} /></PrimaryButton>}
      <SecondaryButton onClick={() => dispatch({ type: "restart" })}><RotateCcw size={17} />重新选择题量</SecondaryButton>
      <p>{isSelf ? "不用一次完成很多，先从此刻最想做的一件开始。" : "真正有趣的答案，要等 TA 完成以后才会出现。"}</p>
    </div>
  </PageContainer>;
}
