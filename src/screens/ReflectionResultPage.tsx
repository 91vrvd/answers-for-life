"use client";

import { Download, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnswerShareCard } from "@/src/components/AnswerShareCard";
import { PageContainer, PrimaryButton, SecondaryButton, Toast } from "@/src/components/ui";
import { getReflectionPrompt } from "@/src/data/reflectionPrompts";
import { downloadAnswerCard } from "@/src/utils/downloadAnswerCard";
import { useLoveBook } from "@/src/state/LoveBookContext";

export function ReflectionResultPage() {
  const { state, dispatch } = useLoveBook();
  const [toast, setToast] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const mode = state.mode ?? "self";
  const answers = useMemo(() => state.selectedPromptIds.map((id) => ({ prompt: getReflectionPrompt(id), answer: state.writtenAnswers[id]?.trim() ?? "" })).filter((item): item is { prompt: NonNullable<typeof item.prompt>; answer: string } => Boolean(item.prompt && item.answer)), [state.selectedPromptIds, state.writtenAnswers]);
  const shareItem = answers.find((item) => item.prompt.id === state.sharePromptId) ?? answers[0];
  const save = () => {
    if (!shareItem) return;
    try {
      const image = downloadAnswerCard(shareItem.prompt, shareItem.answer, mode, state.partnerName);
      setGeneratedImage(image);
      setToast("答案卡已生成，可长按保存");
    } catch {
      setToast("生成失败，请使用系统截图");
    }
    window.setTimeout(() => setToast(""), 2200);
  };
  return <PageContainer className="reflection-result-page">
    <section className="reflection-result-hero"><p className="eyebrow">{mode === "self" ? "写给自己的真实答案" : "你们可以慢慢聊的答案"}</p><h1>{answers.length ? <>有 <em>{answers.length}</em> 个瞬间，<br />你认真听见了心里话</> : <>有些答案，<br />值得再慢慢想一想</>}</h1><p>{mode === "self" ? "不是完成了一套标准题，而是多写下了几条只属于你的“使用说明”。" : "答案不必相同。愿意把真实感受说出来，本身就是一种靠近。"}</p></section>
    {shareItem ? <section className="share-answer-section"><div className="section-heading"><span>这张答案适合留下来</span><small>长按或保存图片</small></div><AnswerShareCard prompt={shareItem.prompt} answer={shareItem.answer} mode={mode} partnerName={state.partnerName} /><PrimaryButton onClick={save}><Download size={17} />生成并保存高清答案卡</PrimaryButton>{generatedImage && <div className="generated-card-preview"><p>高清图片已生成</p><Image src={generatedImage} width={540} height={720} unoptimized alt="生成的答案分享卡" /><a href={generatedImage} download="留白答案.png">下载 PNG</a><span>iPhone 用户可以长按上方图片保存</span></div>}</section> : <div className="soft-empty result-empty">这次没有写下答案，也没关系。<br />等真正想说的时候，再回来就好。</div>}
    {answers.length > 1 && <section className="answer-picker"><div className="section-heading"><span>换一个答案生成卡片</span><small>{answers.length} ANSWERS</small></div>{answers.map(({ prompt, answer }, index) => <button className={shareItem?.prompt.id === prompt.id ? "selected" : ""} key={prompt.id} onClick={() => dispatch({ type: "selectSharePrompt", promptId: prompt.id })}><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{prompt.question}</strong><p>{answer}</p></div></button>)}</section>}
    <div className="result-actions"><SecondaryButton onClick={() => dispatch({ type: "restart" })}><RotateCcw size={17} />再写一组问题</SecondaryButton><p>答案只保存在当前浏览器，图片由你的设备直接生成。</p></div>
    <Toast message={toast} visible={Boolean(toast)} />
  </PageContainer>;
}
