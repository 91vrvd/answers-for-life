"use client";

import { Clock3, WalletCards } from "lucide-react";
import type { Task } from "@/src/data/tasks";
import { Tag } from "./ui";

export function TaskCard({ task, motionClass = "" }: { task: Task; motionClass?: string }) {
  return (
    <article className={`task-card ${motionClass}`}>
      <div className="task-card-topline"><span>{task.category}</span><span>{String(task.id).padStart(2, "0")}</span></div>
      <div className="task-card-copy">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
      </div>
      <div className="task-meta" aria-label="任务标签">
        {task.tags.map((tag, index) => <Tag key={tag}>{index === 0 ? <WalletCards size={13} /> : index === 1 ? <Clock3 size={13} /> : null}{tag}</Tag>)}
      </div>
      <div className="card-lines" aria-hidden="true"><i /><i /></div>
    </article>
  );
}
