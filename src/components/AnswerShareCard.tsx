import type { ReflectionPrompt } from "@/src/data/reflectionPrompts";
import type { LoveMode } from "@/src/data/tasks";

export function AnswerShareCard({ prompt, answer, mode, partnerName }: { prompt: ReflectionPrompt; answer: string; mode: LoveMode; partnerName: string }) {
  return <article className={`answer-share-card ${mode === "self" ? "self-answer-card" : ""}`}>
    <div className="answer-card-lines" aria-hidden="true"><i /><i /><b /></div>
    <header><span>100 LITTLE THINGS ABOUT LOVE</span><em>{prompt.category}</em></header>
    <div className="answer-card-body"><p>今天认真回答了一个问题</p><h2>{prompt.question}</h2><blockquote>{answer || "这道题，我想再慢慢想一想。"}</blockquote></div>
    <footer><span>{mode === "self" ? "写给此刻的自己" : `我 × ${partnerName || "TA"}`}</span><time>{new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date())}</time></footer>
  </article>;
}
