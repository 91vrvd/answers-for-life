"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageContainer, PrimaryButton, ProgressBar, TextButton } from "@/src/components/ui";
import { getReflectionPrompt } from "@/src/data/reflectionPrompts";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ReflectionPage() {
  const { state, dispatch } = useLoveBook();
  const total = state.selectedPromptIds.length;
  const promptId = state.selectedPromptIds[state.reflectionIndex];
  const prompt = getReflectionPrompt(promptId);
  const answer = state.writtenAnswers[promptId] ?? "";
  const back = () => state.reflectionIndex > 0 ? dispatch({ type: "previousReflection" }) : dispatch({ type: "navigate", page: "reflectionIntro" });
  if (!prompt) return null;
  return <PageContainer className="reflection-page">
    <header className="reflection-header"><div><TextButton aria-label="返回上一题" onClick={back}><ArrowLeft size={21} /></TextButton><span>{String(state.reflectionIndex + 1).padStart(2, "0")} <i>/</i> {total}</span><b>{prompt.category}</b></div><ProgressBar value={(state.reflectionIndex + 1) / Math.max(total, 1)} /></header>
    <section className="writing-sheet">
      <p className="section-kicker">QUESTION {String(state.reflectionIndex + 1).padStart(2, "0")}</p>
      <h1>{prompt.question}</h1>
      <p className="writing-helper">{prompt.helper}</p>
      <label htmlFor="reflection-answer">写下你的答案</label>
      <textarea id="reflection-answer" autoFocus maxLength={360} value={answer} placeholder="不用完整，也不需要漂亮。先写下最先出现的那句话……" onChange={(event) => dispatch({ type: "setWrittenAnswer", promptId, value: event.target.value })} />
      <div className="writing-meta"><span>只对自己诚实就好</span><b>{answer.length} / 360</b></div>
    </section>
    <div className="reflection-actions">
      <TextButton onClick={() => dispatch({ type: "nextReflection" })}>这题先跳过</TextButton>
      <PrimaryButton disabled={!answer.trim()} onClick={() => dispatch({ type: "nextReflection" })}>{state.reflectionIndex + 1 >= total ? "整理我的答案" : "保存并写下一题"}<ArrowRight size={18} /></PrimaryButton>
    </div>
  </PageContainer>;
}
