"use client";

import { ArrowRight, Bookmark, ImageDown } from "lucide-react";
import { useMemo, useState } from "react";
import { PageContainer, PrimaryButton, SecondaryButton, Toast } from "@/src/components/ui";
import { getTaskContent, tasks } from "@/src/data/tasks";
import { useLoveBook } from "@/src/state/LoveBookContext";
import { getCoupleResults } from "@/src/utils/results";

export function CoupleResultPage() {
  const { state, dispatch } = useLoveBook();
  const [toast, setToast] = useState("");
  const result = useMemo(() => getCoupleResults(state.answers, state.partnerAnswers, state.selectedTaskIds), [state.answers, state.partnerAnswers, state.selectedTaskIds]);
  const recommended = result.common[0] ?? tasks.find((task) => state.selectedTaskIds.includes(task.id) && state.answers[task.id] === "want") ?? tasks[0];
  const recommendedContent = getTaskContent(recommended, "couple");
  const saveResult = () => { setToast("请使用系统截图保存结果卡片"); window.setTimeout(() => setToast(""), 2200); };
  return <PageContainer className="couple-page">
    <section className="couple-hero">
      <p className="eyebrow">你们的答案已经相遇</p>
      <div className="names"><span>我</span><i>×</i><span>{state.partnerName || "TA"}</span></div>
      <h1>你们有 <em>{result.common.length}</em> 件<br />共同想做的小事</h1>
      <p>在这次随机抽取的 {state.selectedTaskIds.length} 题里，有些事情刚好都想和彼此完成。</p>
      <div className="similarity"><span><b>{result.similarity}%</b> 选择重合度</span><small>仅代表本次选择的相似程度</small></div>
    </section>
    <section className="common-things">
      <div className="section-heading"><span>共同期待</span><small>OUR ANSWERS</small></div>
      <article className="recommended-thing">
        <p>最适合你们先完成的一件事</p><h2>{recommendedContent.title}</h2><span>{recommendedContent.category} · {recommended.tags[0]}</span>
        <button onClick={() => dispatch({ type: "setFirstTask", taskId: recommended.id })}><Bookmark size={16} />把它定为第一件小事</button>
      </article>
      {result.common.slice(1, 5).map((task, index) => { const content = getTaskContent(task, "couple"); return <div className="common-row" key={task.id}><b>{String(index + 2).padStart(2, "0")}</b><span>{content.title}</span><small>{content.category}</small></div>; })}
    </section>
    <section className="differences">
      <p className="section-kicker">你们不一样的地方</p>
      <div><span>你更期待</span><strong>{result.myCategory}</strong></div><i />
      <div><span>TA 更期待</span><strong>{result.theirCategory}</strong></div>
      <p>表达爱的方式不同，不代表期待的爱更少。</p>
    </section>
    <div className="result-actions">
      <PrimaryButton onClick={() => dispatch({ type: "navigate", page: "things" })}>进入我们的100件小事<ArrowRight size={18} /></PrimaryButton>
      <SecondaryButton onClick={saveResult}><ImageDown size={17} />生成结果卡片</SecondaryButton>
    </div>
    <Toast message={toast} visible={Boolean(toast)} />
  </PageContainer>;
}
