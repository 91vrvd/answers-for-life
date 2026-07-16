"use client";

import { ArrowRight, Camera, CheckCircle2, MessageCircle, TimerReset } from "lucide-react";
import { BottomNavigation, PageContainer, PrimaryButton, Toast } from "@/src/components/ui";
import { tasks } from "@/src/data/tasks";
import { useLoveBook } from "@/src/state/LoveBookContext";
import { useState } from "react";

export function ThingsPage() {
  const { state, dispatch } = useLoveBook();
  const [toast, setToast] = useState("");
  const task = tasks.find((item) => item.id === state.firstTaskId) ?? tasks[0];
  const start = () => { setToast("第一件小事已准备好，记录功能即将开放"); window.setTimeout(() => setToast(""), 2400); };
  const futures = [{ icon: CheckCircle2, label: "共同打卡" }, { icon: Camera, label: "上传照片" }, { icon: MessageCircle, label: "双人留言" }, { icon: TimerReset, label: "回忆时间轴" }];
  return <PageContainer className="things-page" bottomNav>
    <header className="things-header"><div><p>OUR LITTLE THINGS</p><h1>我们的100件小事</h1></div><span>0 <i>/</i> 100</span></header>
    <div className="things-progress"><i><b style={{ width: "2%" }} /></i><span>故事才刚刚开始</span></div>
    <section className="first-thing">
      <div className="first-thing-number">01</div>
      <p>你们的第一件小事</p>
      <h2>{task.title}</h2>
      <span>{task.description}</span>
      <PrimaryButton onClick={start}>开始第一件小事<ArrowRight size={18} /></PrimaryButton>
    </section>
    <section className="future-section"><div className="section-heading"><span>更多共同记录</span><small>正在准备中</small></div><div className="future-grid">{futures.map(({ icon: Icon, label }) => <div key={label}><Icon size={19} strokeWidth={1.5} /><span>{label}</span></div>)}</div></section>
    <BottomNavigation active="things" onNavigate={(page) => dispatch({ type: "navigate", page })} />
    <Toast message={toast} visible={Boolean(toast)} />
  </PageContainer>;
}
