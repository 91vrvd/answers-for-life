import { tasks } from "@/src/data/tasks";
import type { Answer } from "@/src/state/LoveBookContext";

export function categoryCounts(answers: Record<number, Answer>) {
  return tasks.reduce<Record<string, number>>((acc, task) => {
    if (answers[task.id] === "want") acc[task.category] = (acc[task.category] ?? 0) + 1;
    return acc;
  }, {});
}

export function topCategory(answers: Record<number, Answer>) {
  const sorted = Object.entries(categoryCounts(answers)).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "平凡日常";
}

export function personalHeadline(answers: Record<number, Answer>) {
  const sorted = Object.entries(categoryCounts(answers)).sort((a, b) => b[1] - a[1]);
  if (!sorted.length || (sorted[1] && sorted[0][1] === sorted[1][1])) return "你期待的爱，是把平凡日子过成共同回忆";
  const lines: Record<string, string> = {
    平凡日常: "你期待的爱，是有人陪你认真生活",
    浪漫仪式: "你期待的爱，是被认真放在心上",
    旅行探索: "你期待的爱，是一起走向更远的地方",
    深度交流: "你期待的爱，是被真正理解",
    照顾陪伴: "你期待的爱，是困难时仍然有人在",
    共同成长: "你期待的爱，是两个人一起变得更好",
  };
  return lines[sorted[0][0]] ?? "你期待的爱，是把平凡日子过成共同回忆";
}

export function getCoupleResults(mine: Record<number, Answer>, theirs: Record<number, Answer>) {
  const common = tasks.filter((task) => mine[task.id] === "want" && theirs[task.id] === "want");
  const same = tasks.filter((task) => mine[task.id] && mine[task.id] === theirs[task.id]).length;
  return { common, similarity: Math.round((same / tasks.length) * 100), myCategory: topCategory(mine), theirCategory: topCategory(theirs) };
}
