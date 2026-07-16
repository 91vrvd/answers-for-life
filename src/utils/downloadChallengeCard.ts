import { challengeTasks } from "@/src/data/challengeTasks";

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const character of text) {
    const candidate = line + character;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = character;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function downloadChallengeCard(completedIds: number[], customTitles: Record<number, string>) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.fillStyle = "#F8F6F2";
  context.fillRect(0, 0, 1080, 1440);
  context.strokeStyle = "rgba(128,151,131,.45)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(-60, 1140);
  context.bezierCurveTo(260, 850, 650, 1120, 1130, 810);
  context.stroke();
  context.strokeStyle = "rgba(184,111,114,.32)";
  context.beginPath();
  context.moveTo(650, -40);
  context.bezierCurveTo(1000, 220, 780, 480, 1140, 700);
  context.stroke();

  context.fillStyle = "#77716B";
  context.font = "600 24px Arial, sans-serif";
  context.letterSpacing = "5px";
  context.fillText("30 DAYS · A NEW ME", 84, 100);
  context.letterSpacing = "0px";
  context.fillStyle = "#242220";
  context.font = "600 66px 'Songti SC', 'STSong', serif";
  context.fillText("30天全新自己挑战", 84, 220);
  context.fillStyle = "#77716B";
  context.font = "400 26px 'PingFang SC', sans-serif";
  context.fillText("不必连续，也不必按顺序。每完成一次，生活就多一点新的可能。", 84, 276);

  const progress = Math.round((completedIds.length / challengeTasks.length) * 100);
  context.fillStyle = "#809783";
  context.font = "500 112px 'Songti SC', 'STSong', serif";
  context.fillText(String(completedIds.length).padStart(2, "0"), 84, 438);
  context.fillStyle = "#77716B";
  context.font = "500 28px 'PingFang SC', sans-serif";
  context.fillText("/ 30 已完成", 238, 430);
  context.textAlign = "right";
  context.fillText(`${progress}%`, 996, 430);
  context.textAlign = "left";
  context.fillStyle = "#E3E0DA";
  context.fillRect(84, 472, 912, 8);
  context.fillStyle = "#809783";
  context.fillRect(84, 472, 912 * (completedIds.length / 30), 8);

  context.fillStyle = "#809783";
  context.font = "600 24px 'PingFang SC', sans-serif";
  context.fillText(completedIds.length ? "我已经做到" : "我准备开始", 84, 560);
  const completed = completedIds.map((id) => challengeTasks.find((task) => task.id === id)).filter(Boolean).slice(-9);
  let y = 630;
  context.font = "500 32px 'PingFang SC', sans-serif";
  context.fillStyle = "#35312E";
  for (const task of completed) {
    if (!task) continue;
    const title = customTitles[task.id] || task.title;
    const lines = wrapText(context, title, 790).slice(0, 2);
    context.strokeStyle = "#809783";
    context.lineWidth = 3;
    context.strokeRect(86, y - 23, 24, 24);
    context.beginPath();
    context.moveTo(91, y - 11);
    context.lineTo(99, y - 3);
    context.lineTo(113, y - 19);
    context.stroke();
    lines.forEach((line, index) => context.fillText(line, 136, y + index * 45));
    y += lines.length > 1 ? 112 : 72;
  }
  if (!completed.length) {
    context.fillStyle = "#77716B";
    context.font = "400 36px 'Kaiti SC', 'STKaiti', 'PingFang SC', sans-serif";
    context.fillText("今天，先从一件很小的事开始。", 84, 640);
  }

  context.fillStyle = "#77716B";
  context.font = "400 24px 'PingFang SC', sans-serif";
  context.fillText("写给正在重新找回生活感觉的自己", 84, 1350);
  context.textAlign = "right";
  context.fillText(new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date()), 996, 1350);
  context.textAlign = "left";

  const url = canvas.toDataURL("image/png", 1);
  const link = document.createElement("a");
  link.href = url;
  link.download = `30天全新自己挑战-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return url;
}
