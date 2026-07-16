"use client";

import { Clock3, WalletCards } from "lucide-react";
import { getTaskContent, type LoveMode, type Task } from "@/src/data/tasks";
import { Tag } from "./ui";

export function TaskCard({ task, mode, motionClass = "" }: { task: Task; mode: LoveMode; motionClass?: string }) {
  const content = getTaskContent(task, mode);
  const tags = mode === "self" ? ["一个人也可以", task.tags[1], "好好生活"] : task.tags;
  return (
    <article className={`task-card ${motionClass}`}>
      <div className="task-card-topline"><span>{content.category}</span><span>{String(task.id).padStart(3, "0")}</span></div>
      <div className="task-card-copy">
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>
      <div className="task-meta" aria-label="任务标签">
        {tags.map((tag, index) => <Tag key={tag}>{index === 0 ? <WalletCards size={13} /> : index === 1 ? <Clock3 size={13} /> : null}{tag}</Tag>)}
      </div>
      <div className="card-lines" aria-hidden="true"><i /><i /></div>
    </article>
  );
}
