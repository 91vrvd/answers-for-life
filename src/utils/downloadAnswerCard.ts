import type { ReflectionPrompt } from "@/src/data/reflectionPrompts";
import type { LoveMode } from "@/src/data/tasks";

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const character of text) {
    const candidate = line + character;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = character;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(context: CanvasRenderingContext2D, lines: string[], x: number, y: number, lineHeight: number, maxLines: number) {
  lines.slice(0, maxLines).forEach((line, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? "…" : "";
    context.fillText(`${line}${suffix}`, x, y + index * lineHeight);
  });
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

export function downloadAnswerCard(prompt: ReflectionPrompt, answer: string, mode: LoveMode, partnerName: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.fillStyle = "#F8F6F2";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 3;
  context.strokeStyle = mode === "self" ? "rgba(128,151,131,.48)" : "rgba(184,111,114,.48)";
  context.beginPath();
  context.moveTo(660, -40);
  context.bezierCurveTo(980, 180, 760, 500, 1120, 760);
  context.stroke();
  context.strokeStyle = mode === "self" ? "rgba(184,111,114,.32)" : "rgba(128,151,131,.38)";
  context.beginPath();
  context.moveTo(1120, 90);
  context.bezierCurveTo(760, 260, 1020, 560, 640, 850);
  context.stroke();

  context.fillStyle = "#77716B";
  context.font = "600 24px Arial, sans-serif";
  context.letterSpacing = "5px";
  context.fillText("100 LITTLE THINGS ABOUT LOVE", 88, 104);
  context.letterSpacing = "0px";
  context.fillStyle = mode === "self" ? "#809783" : "#B86F72";
  context.font = "600 26px 'PingFang SC', sans-serif";
  context.fillText(prompt.category, 88, 178);

  context.fillStyle = "#242220";
  context.font = "600 58px 'Songti SC', 'STSong', serif";
  const questionLines = wrapText(context, prompt.question, 860);
  let cursor = drawLines(context, questionLines, 88, 290, 82, 4) + 34;
  context.strokeStyle = "#DED8D2";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(88, cursor);
  context.lineTo(992, cursor);
  context.stroke();
  cursor += 80;

  context.fillStyle = "#A49E97";
  context.font = "500 24px 'PingFang SC', sans-serif";
  context.fillText("我的答案", 88, cursor);
  cursor += 70;
  context.fillStyle = "#3E3935";
  context.font = "400 40px 'Kaiti SC', 'STKaiti', 'PingFang SC', sans-serif";
  const answerLines = wrapText(context, answer || "这道题，我想再慢慢想一想。", 860);
  drawLines(context, answerLines, 88, cursor, 62, 9);

  context.fillStyle = "#77716B";
  context.font = "400 24px 'PingFang SC', sans-serif";
  context.fillText(mode === "self" ? "写给此刻的自己" : `我 × ${partnerName || "TA"}`, 88, 1342);
  context.textAlign = "right";
  context.fillText(new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date()), 992, 1342);
  context.textAlign = "left";

  context.fillStyle = "#8F8882";
  context.font = "500 20px 'PingFang SC', sans-serif";
  context.textAlign = "center";
  context.fillText("给生活的答案｜微信搜索同名小程序", 540, 1402);
  context.textAlign = "left";

  const url = canvas.toDataURL("image/png", 1);
  const link = document.createElement("a");
  link.href = url;
  link.download = `给生活的答案-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return url;
}
