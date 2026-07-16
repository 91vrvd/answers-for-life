"use client";

import { ArrowLeft, Check, Dice5, Download, Pencil, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PageContainer, PrimaryButton, TextButton, Toast } from "@/src/components/ui";
import { challengeTasks } from "@/src/data/challengeTasks";
import { useLoveBook } from "@/src/state/LoveBookContext";
import { downloadChallengeCard } from "@/src/utils/downloadChallengeCard";

type Filter = "all" | "todo" | "done";

export function ChallengePage() {
  const { state, dispatch } = useLoveBook();
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [suggestedId, setSuggestedId] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState("");
  const [toast, setToast] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const completed = state.challengeCompletedIds;
  const progress = completed.length / challengeTasks.length;
  const visibleTasks = useMemo(() => challengeTasks.filter((task) => filter === "all" || (filter === "done" ? completed.includes(task.id) : !completed.includes(task.id))), [filter, completed]);
  const titleFor = (id: number, fallback: string) => state.challengeCustomTitles[id] || fallback;
  const chooseToday = () => {
    const remaining = challengeTasks.filter((task) => !completed.includes(task.id));
    const chosen = remaining[Math.floor(Math.random() * remaining.length)];
    setSuggestedId(chosen?.id ?? null);
    setToast(chosen ? "替你选好今天的一件小事" : "30件小事已经全部完成");
    window.setTimeout(() => setToast(""), 1800);
  };
  const startEdit = (id: number, fallback: string) => {
    setEditingId(id);
    setDraft(titleFor(id, fallback));
  };
  const saveEdit = (id: number) => {
    dispatch({ type: "updateChallengeTask", taskId: id, title: draft });
    setEditingId(null);
  };
  const saveCard = () => {
    try {
      setGeneratedImage(downloadChallengeCard(completed, state.challengeCustomTitles));
      setToast("进度卡已生成，可长按保存");
    } catch {
      setToast("生成失败，请使用系统截图");
    }
    window.setTimeout(() => setToast(""), 2200);
  };
  const reset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 2400);
      return;
    }
    dispatch({ type: "resetChallenge" });
    setConfirmReset(false);
    setGeneratedImage("");
  };

  return <PageContainer className="challenge-page">
    <header className="simple-header"><TextButton aria-label="返回体验选择" onClick={() => dispatch({ type: "navigate", page: "journey" })}><ArrowLeft size={21} /></TextButton><span>写给自己</span></header>
    <section className="challenge-hero">
      <p className="eyebrow">30 DAYS · A NEW ME</p>
      <h1>30天<br />全新自己挑战</h1>
      <p>不需要连续30天，也不用按顺序。<br />每件事完成一次，就算认真生活了一次。</p>
      <div className="challenge-progress-copy"><strong>{String(completed.length).padStart(2, "0")}</strong><span>/ 30 已完成</span><b>{Math.round(progress * 100)}%</b></div>
      <div className="challenge-progress"><i style={{ width: `${progress * 100}%` }} /></div>
    </section>

    <section className="today-challenge">
      <div><small>不知道先做哪件？</small><strong>{suggestedId ? titleFor(suggestedId, challengeTasks.find((task) => task.id === suggestedId)?.title ?? "") : "让直觉替你选一件"}</strong></div>
      <button onClick={chooseToday}><Dice5 size={18} /><span>{suggestedId ? "换一件" : "抽一件"}</span></button>
    </section>

    <div className="challenge-toolbar">
      <div role="group" aria-label="筛选挑战任务">{(["all", "todo", "done"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "all" ? "全部" : value === "todo" ? "待完成" : "已完成"}</button>)}</div>
      <span>点铅笔可换成自己的任务</span>
    </div>

    <section className="challenge-list">
      {visibleTasks.map((task) => {
        const isDone = completed.includes(task.id);
        const isEditing = editingId === task.id;
        return <article key={task.id} className={`${isDone ? "done" : ""} ${suggestedId === task.id ? "suggested" : ""}`}>
          <button className="challenge-check" aria-label={isDone ? `取消完成：${titleFor(task.id, task.title)}` : `标记完成：${titleFor(task.id, task.title)}`} onClick={() => dispatch({ type: "toggleChallenge", taskId: task.id })}>{isDone ? <Check size={16} /> : <span>{String(task.id).padStart(2, "0")}</span>}</button>
          <div>
            <small>{task.category}{state.challengeCustomTitles[task.id] ? " · 已自定义" : ""}</small>
            {isEditing ? <div className="challenge-editor"><input autoFocus maxLength={42} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveEdit(task.id); if (event.key === "Escape") setEditingId(null); }} /><button aria-label="保存修改" disabled={!draft.trim()} onClick={() => saveEdit(task.id)}><Check size={17} /></button><button aria-label="取消修改" onClick={() => setEditingId(null)}><X size={17} /></button></div> : <><h2>{titleFor(task.id, task.title)}</h2><p>{task.description}</p></>}
          </div>
          {!isEditing && <button className="challenge-edit" aria-label={`修改：${titleFor(task.id, task.title)}`} onClick={() => startEdit(task.id, task.title)}><Pencil size={15} /></button>}
        </article>;
      })}
    </section>

    <section className="challenge-share">
      <p className="section-kicker">把变化留下来</p>
      <h2>{completed.length ? `你已经为自己完成了 ${completed.length} 件事` : "开始以后，再回来保存这张卡"}</h2>
      <p>生成一张竖版进度卡，记录你已经做到的事。</p>
      <PrimaryButton disabled={!completed.length} onClick={saveCard}><Download size={17} />生成我的挑战进度卡</PrimaryButton>
      {generatedImage && <div className="generated-card-preview"><p>高清图片已生成</p><Image src={generatedImage} width={540} height={720} unoptimized alt="30天全新自己挑战进度卡" /><a href={generatedImage} download="30天全新自己挑战.png">下载 PNG</a><span>iPhone 用户可以长按上方图片保存</span></div>}
    </section>
    <TextButton className={`challenge-reset ${confirmReset ? "confirm" : ""}`} onClick={reset}><RotateCcw size={14} />{confirmReset ? "再点一次确认重新开始" : "清空进度，重新开始"}</TextButton>
    <p className="challenge-privacy">所有进度和自定义内容只保存在当前浏览器</p>
    <Toast message={toast} visible={Boolean(toast)} />
  </PageContainer>;
}
