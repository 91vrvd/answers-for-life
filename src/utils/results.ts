import { getTaskContent, tasks, type LoveMode } from "@/src/data/tasks";
import type { Answer } from "@/src/state/LoveBookContext";

export function selectedTasks(taskIds: number[]) {
  const ids = new Set(taskIds);
  return tasks.filter((task) => ids.has(task.id));
}

export function categoryCounts(answers: Record<number, Answer>, taskIds: number[], mode: LoveMode) {
  return selectedTasks(taskIds).reduce<Record<string, number>>((acc, task) => {
    if (answers[task.id] === "want") {
      const category = getTaskContent(task, mode).category;
      acc[category] = (acc[category] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function topCategory(answers: Record<number, Answer>, taskIds: number[], mode: LoveMode) {
  const sorted = Object.entries(categoryCounts(answers, taskIds, mode)).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? (mode === "self" ? "日常善待" : "平凡日常");
}

export function personalHeadline(answers: Record<number, Answer>, taskIds: number[], mode: LoveMode) {
  const sorted = Object.entries(categoryCounts(answers, taskIds, mode)).sort((a, b) => b[1] - a[1]);
  if (!sorted.length || (sorted[1] && sorted[0][1] === sorted[1][1])) {
    return mode === "self" ? "你正在学习，把自己也放进生活里" : "你期待的爱，是把平凡日子过成共同回忆";
  }
  const coupleLines: Record<string, string> = {
    平凡日常: "你期待的爱，是有人陪你认真生活",
    浪漫仪式: "你期待的爱，是被认真放在心上",
    旅行探索: "你期待的爱，是一起走向更远的地方",
    深度交流: "你期待的爱，是被真正理解",
    照顾陪伴: "你期待的爱，是困难时仍然有人在",
    共同成长: "你期待的爱，是两个人一起变得更好",
    吃喝约会: "你期待的爱，是分享每一口生活的滋味",
    未来想象: "你期待的爱，是未来里也有彼此的位置",
    身心照顾: "你期待的爱，是认真照顾彼此的生活",
    勇敢尝试: "你期待的爱，是有人陪你去试新的可能",
  };
  const selfLines: Record<string, string> = {
    日常善待: "你想要的爱，是先把自己的日子照顾好",
    内心对话: "你想要的爱，是诚实听见自己的声音",
    自我仪式: "你想要的爱，是认真纪念自己的生活",
    独自探索: "你想要的爱，是自由走向更大的世界",
    温柔陪伴: "你想要的爱，是难过时也不丢下自己",
    自我成长: "你想要的爱，是相信自己可以慢慢变好",
    味觉照顾: "你想要的爱，是不等别人也能好好生活",
    人生想象: "你想要的爱，是把人生还给真正的自己",
    身心照顾: "你想要的爱，是尊重身体也照顾情绪",
    勇敢尝试: "你想要的爱，是带着自己去见新的可能",
  };
  const category = sorted[0][0];
  return mode === "self" ? selfLines[category] : coupleLines[category];
}

export function getCoupleResults(mine: Record<number, Answer>, theirs: Record<number, Answer>, taskIds: number[]) {
  const pool = selectedTasks(taskIds);
  const common = pool.filter((task) => mine[task.id] === "want" && theirs[task.id] === "want");
  const same = pool.filter((task) => mine[task.id] && mine[task.id] === theirs[task.id]).length;
  const total = Math.max(pool.length, 1);
  return {
    common,
    similarity: Math.round((same / total) * 100),
    myCategory: topCategory(mine, taskIds, "couple"),
    theirCategory: topCategory(theirs, taskIds, "couple"),
  };
}
