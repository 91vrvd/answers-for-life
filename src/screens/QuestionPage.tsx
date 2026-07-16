"use client";

import { ArrowLeft, Check, Minus, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { TaskCard } from "@/src/components/TaskCard";
import { PageContainer, ProgressBar, TextButton } from "@/src/components/ui";
import { getTaskContent, tasks } from "@/src/data/tasks";
import { type Answer, useLoveBook } from "@/src/state/LoveBookContext";

export function QuestionPage() {
  const { state, dispatch } = useLoveBook();
  const [motion, setMotion] = useState("");
  const touchStart = useRef<number | null>(null);
  const total = state.selectedTaskIds.length;
  const taskId = state.selectedTaskIds[Math.min(state.currentIndex, Math.max(total - 1, 0))];
  const task = tasks.find((item) => item.id === taskId) ?? tasks[0];
  const mode = state.mode ?? "couple";
  const content = getTaskContent(task, mode);

  const choose = (answer: Answer) => {
    if (motion) return;
    setMotion(answer === "want" ? "card-exit-right" : "card-exit-left");
    window.setTimeout(() => {
      dispatch({ type: "answer", taskId: task.id, answer });
      setMotion("card-enter");
      window.setTimeout(() => setMotion(""), 280);
    }, 260);
  };
  const back = () => state.currentIndex > 0 ? dispatch({ type: "previousQuestion" }) : dispatch({ type: "navigate", page: "intro" });
  const doneLabel = mode === "self" ? "已经为自己做过" : "已经一起做过";
  const wantLabel = mode === "self" ? "很想为自己做" : "很想和 TA 做";

  return <PageContainer className="question-page">
    <header className="question-header">
      <div className="question-topline"><TextButton aria-label="返回上一题" onClick={back}><ArrowLeft size={21} /></TextButton><span>{String(state.currentIndex + 1).padStart(2, "0")} <i>/</i> {total}</span><b>{content.category}</b></div>
      <ProgressBar value={(state.currentIndex + 1) / Math.max(total, 1)} />
    </header>
    <div className="question-stage" onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current == null) return; const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 70) choose(delta > 0 ? "want" : "skip"); touchStart.current = null; }}>
      <TaskCard task={task} mode={mode} motionClass={motion} />
      <p className="swipe-hint">本轮从 100 题中随机抽取 · 左右滑动也可以</p>
    </div>
    <div className="answer-actions">
      <button className="answer-button skip" onClick={() => choose("skip")}><Minus size={18} /><span>暂时没感觉</span></button>
      <button className="answer-button done" onClick={() => choose("done")}><Check size={18} /><span>{doneLabel}</span></button>
      <button className="answer-button want" onClick={() => choose("want")}><Sparkles size={18} /><span>{wantLabel}</span></button>
    </div>
  </PageContainer>;
}
