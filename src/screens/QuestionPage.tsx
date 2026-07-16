"use client";

import { ArrowLeft, Check, Minus, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { TaskCard } from "@/src/components/TaskCard";
import { PageContainer, ProgressBar, TextButton } from "@/src/components/ui";
import { tasks } from "@/src/data/tasks";
import { type Answer, useLoveBook } from "@/src/state/LoveBookContext";

export function QuestionPage() {
  const { state, dispatch } = useLoveBook();
  const [motion, setMotion] = useState("");
  const touchStart = useRef<number | null>(null);
  const task = tasks[Math.min(state.currentIndex, tasks.length - 1)];

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

  return <PageContainer className="question-page">
    <header className="question-header">
      <div className="question-topline"><TextButton aria-label="返回上一题" onClick={back}><ArrowLeft size={21} /></TextButton><span>{String(state.currentIndex + 1).padStart(2, "0")} <i>/</i> 15</span><b>{task.category}</b></div>
      <ProgressBar value={(state.currentIndex + 1) / tasks.length} />
    </header>
    <div className="question-stage" onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current == null) return; const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 70) choose(delta > 0 ? "want" : "skip"); touchStart.current = null; }}>
      <TaskCard task={task} motionClass={motion} />
      <p className="swipe-hint">也可以轻轻左右滑动</p>
    </div>
    <div className="answer-actions">
      <button className="answer-button skip" onClick={() => choose("skip")}><Minus size={18} /><span>暂时没感觉</span></button>
      <button className="answer-button done" onClick={() => choose("done")}><Check size={18} /><span>已经做过</span></button>
      <button className="answer-button want" onClick={() => choose("want")}><Sparkles size={18} /><span>很想和 TA 做</span></button>
    </div>
  </PageContainer>;
}
